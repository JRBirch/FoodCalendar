import {FoodDoc} from "../../../../../backend/src/models/food"

import Styles from "./DayStyles.module.css";

type Day = {
  days: string[];
  day: number;
  date: Date;
  foodsForDay: FoodDoc[];
  handleClick: (date: Date) => void;
};

const CalendarDay = ({ handleClick, days, day, date, foodsForDay }: Day) => {
  return (
    <div onClick={() => handleClick(date)} className={Styles.day}>
      <h4>{`${days[date.getDay()]}, ${day}`}</h4>
      <ul>
        {foodsForDay.map((food)=>{
            return <li className={Styles.food}>{food.name}</li>
        })}
      </ul>
    </div>
  );
};
export default CalendarDay;
