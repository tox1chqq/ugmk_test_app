import React, { useEffect, useMemo, useState } from "react";
import { Bar, BarChart, Legend, Tooltip, XAxis, YAxis } from "recharts";

import moment from "moment";
import "moment/locale/ru";
import {
  API_URL,
  DEFAULT_FILTER_VALUE,
  FILTER_OPTIONS,
  TON_PER_KILOGRAMS_COF,
} from "../../constants";
import { getMonth, getMonthRus } from "../../utils";
import { useNavigate } from "react-router-dom";
import styles from "./Main.module.css";

moment.locale("ru");

export const Main = () => {
  const navigate = useNavigate();

  const [data, setData] = useState([]);
  const [filter, setFilter] = useState(
    localStorage.getItem("filter") || DEFAULT_FILTER_VALUE
  );

  const handleFilterSave = (value) => {
    localStorage.setItem("filter", value);
    setFilter(value);
  };

  const handleClick = (data) => {
    const factoryId = data.tooltipPayload[0].dataKey.split(".")[0];
    const monthNumber = data.month.split("/")[0];

    navigate(`/details/${factoryId}/${monthNumber}`, {
      state: { data },
    });
  };

  const chartData = useMemo(() => {
    const result = [];
    const filteredData = data.filter((obj) => obj.date !== null);

    const totalProductsDate = filteredData.reduce(
      (acc, { factory_id, product1, product2, date }) => {
        const month = getMonth(date);
        let value = 0;

        const mothName = getMonthRus(date);

        switch (filter) {
          case "all":
            value = product1 + product2;
            break;
          case "product1":
            value = product1;
            break;
          case "product2":
            value = product2;
            break;
          default:
            break;
        }

        if (!acc[month]) {
          acc[month] = {
            [factory_id]: {
              total: 0,
              product1: 0,
              product2: 0,
            },
            mothName,
            month,
          };
        }

        if (!acc[month][factory_id]) {
          acc[month][factory_id] = {
            total: 0,
            product1: 0,
            product2: 0,
          };
        }

        acc[month][factory_id].total += value / TON_PER_KILOGRAMS_COF;
        acc[month][factory_id].product1 += product1 / TON_PER_KILOGRAMS_COF;
        acc[month][factory_id].product2 += product2 / TON_PER_KILOGRAMS_COF;

        return acc;
      },
      {}
    );

    for (const key in totalProductsDate) {
      result.push(totalProductsDate[key]);
    }

    result.sort(
      (a, b) => moment(a.month, "MM/YYYY") - moment(b.month, "MM/YYYY")
    );

    return result;
  }, [data, filter]);

  useEffect(() => {
    (async () => {
      try {
        const response = await fetch(API_URL);
        const products = await response.json();

        setData(products);
      } catch (error) {
        console.error(error);
      }
    })();
  }, []);

  return (
    <div className={styles.wrapper}>
      <div>
        <label htmlFor="filter">Фильтр по типу продукции</label>
        <select
          id="filter"
          onChange={(e) => handleFilterSave(e.target.value)}
          value={filter}
        >
          {FILTER_OPTIONS.map((option) => (
            <option key={option.id} value={option.id}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
      <div>
        <BarChart data={chartData} width={1000} height={300}>
          <XAxis dataKey="mothName" />
          <YAxis />
          <Legend />
          <Tooltip />
          <Bar
            dataKey="1.total"
            fill="#ff0000"
            name="Фабрика А"
            onClick={handleClick}
          />
          <Bar
            dataKey="2.total"
            fill="#0000ff"
            name="Фабрика Б"
            onClick={handleClick}
          />
        </BarChart>
      </div>
    </div>
  );
};
