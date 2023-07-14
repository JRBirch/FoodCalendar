import { useNavigate } from "react-router-dom";

import { dayString, sameDay } from "../../utility/date";
import { FoodDoc } from "../../../../../backend/src/models/types";

import Styles from "./DayStyles.module.css";

type Day = {
  date: Date;
  foodsForDay: FoodDoc[];
};

const CalendarDay = ({ date, foodsForDay }: Day) => {
  const navigate = useNavigate();

  const handleClick = (date: Date) => {
    navigate(`/foodlist/${date.toISOString()}`);
  };

  const today = new Date();

  return (
    <div onClick={() => handleClick(date)} className={Styles.day}>
      <h4
        className={`${Styles.heading} ${sameDay(today, date) ? Styles.today_heading : ""}`}
      >{`${dayString(date.getDay())}, ${date.getDate()}`}</h4>
      <ul>
        {foodsForDay.map((food, index) => {
          return <li key={index} className={Styles.food}>{food.name}</li>;
        })}
      </ul>
    </div>
  );
};
export default CalendarDay;
