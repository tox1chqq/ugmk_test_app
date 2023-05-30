import React from "react";
import { useLocation } from "react-router-dom";
import { Cell, LabelList, Legend, Pie, PieChart } from "recharts";
import { COLORS } from "../../constants";
import styles from "./Detail.module.css";

export const Details = () => {
  const location = useLocation();
  const { data } = location.state;

  const dataDetails = [
    { name: "Продукт 1", value: data["1"].product1 },
    { name: "Продукт 2", value: data["2"].product2 },
  ];

  return (
    <div className={styles.container}>
      <h1>
        Статистика продукции {data.tooltipPayload[0].name} за {data.month}
      </h1>
      <PieChart width={400} height={400}>
        <Legend />

        <Pie data={dataDetails} cx="50%" cy="50%" dataKey="value">
          <LabelList dataKey="value" position="outside" offset={15} />

          {dataDetails.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index]} />
          ))}
        </Pie>
      </PieChart>
    </div>
  );
};

export default Details;
