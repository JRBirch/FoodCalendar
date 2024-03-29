/**
 * Utility functions for dates
 */

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const monthString = (month: number): string => {
  return months[month];
};

const dayString = (day: number): string => {
  return days[day];
};

const daysInMonth = (month: number, year: number): number => {
  return new Date(year, month + 1, 0).getDate();
};

const sameDay = (date1: Date, date2: Date): boolean => {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
};

export { monthString, dayString, daysInMonth, sameDay };
