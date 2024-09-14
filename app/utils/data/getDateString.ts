const getDateString = (date: Date) => {
  let dateString = String(date.getFullYear());
  dateString += "-";

  let month = String(date.getMonth() + 1);
  if (month.length === 1) {
    month = `0${month}`;
  }
  dateString += month;
  dateString += "-";

  let day = String(date.getDate());
  if (day.length === 1) {
    day = `0${day}`;
  }
  dateString += day

  return dateString;
}

export default getDateString;

