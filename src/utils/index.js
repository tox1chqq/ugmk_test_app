import moment from "moment/moment";

export const getMonth = (date) => {
  if (!date) return null;

  const [day, month, year] = date.split("/");
  const formattedDate = `${month}/${year}`;

  return formattedDate;
};

export const getMonthRus = (date) => {
  if (!date) return null;

  const newDate = moment(date, "DD/M/YYYY").format("MMMM");
  const formattedDate = newDate.charAt(0).toUpperCase() + newDate.slice(1, 3);

  return formattedDate;
};
