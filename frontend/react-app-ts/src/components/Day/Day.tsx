import { useNavigate } from "react-router-dom";

import { dayString } from "../../utility/date";
import { FoodDoc } from "../../../../../backend/src/models/food";

import Styles from "./DayStyles.module.css";

type Day = {
  date: Date;
  foodsForDay: FoodDoc[];
};

const CalendarDay = ({ date, foodsForDay }: Day) => {
  const navigate = useNavigate();

  const handleClick = (date: Date) => {
    navigate("/foodlist", { state: { date } });
  };

  return (
    <div onClick={() => handleClick(date)} className={Styles.day}>
      <h4>{`${dayString(date.getDay())}, ${date.getDate()}`}</h4>
      <ul>
        {foodsForDay.map((food) => {
          return <li className={Styles.food}>{food.name}</li>;
        })}
      </ul>
    </div>
  );
};
export default CalendarDay;
