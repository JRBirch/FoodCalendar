import { ReactElement, useEffect, useState } from "react";
import { AiOutlineArrowLeft, AiOutlineArrowRight } from "react-icons/ai";
import axios from "axios";

import { RecordsGroupedByDate } from "../../../../../backend/src/controllers/foods.ts";
import Day from "../../components/Day/Day.tsx";
import { daysInMonth, monthString } from "../../utility/date.tsx";
import Loading from "../../components/Loading/Loading.tsx";

import Styles from "./FoodCalendarStyles.module.css";

type CalendarDate = {
  month: number;
  year: number;
};

const date = new Date();
const initialMonthAndYear: CalendarDate = {
  month: date.getMonth(),
  year: date.getFullYear(),
};

const FoodCalendar = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [monthAndYear, setMonthAndYear] = useState<CalendarDate>(initialMonthAndYear);
  const [foodsGroupedDate, setFoodsGroupedDate] = useState<RecordsGroupedByDate>({});

  const increaseMonth = () => {
    let month = monthAndYear.month + 1;
    if (month > 11) {
      month -= 12;
      setMonthAndYear({ year: monthAndYear.year + 1, month });
    } else {
      setMonthAndYear({ ...monthAndYear, month });
    }
  };

  const decreaseMonth = () => {
    let month = monthAndYear.month - 1;
    if (month < 0) {
      month += 12;
      setMonthAndYear({ year: monthAndYear.year - 1, month });
    } else {
      setMonthAndYear({ ...monthAndYear, month });
    }
  };

  const fetchData = async (): Promise<void> => {
    setIsLoading(true)
    try {
      const noDays = daysInMonth(monthAndYear.month, monthAndYear.year);
      const from = new Date(monthAndYear.year, monthAndYear.month, 1);
      const to = new Date(monthAndYear.year, monthAndYear.month, noDays);
      const resp = await axios.get("/api/v1/foods", {
        params: { from, to, limit: 4 },
      });
      const foods: RecordsGroupedByDate = resp.data;
      setFoodsGroupedDate(foods);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  // Everytime the month changes fetch the information for that month
  // This means we batch fetch the information for all the days which is much more efficient
  // then sending a request for every day
  useEffect(() => {
    fetchData();
  }, [monthAndYear.month]);

  const day_elements: ReactElement[] = [];
  for (let i = 1; i <= daysInMonth(monthAndYear.month, monthAndYear.year); i++) {
    let date = new Date(monthAndYear.year, monthAndYear.month, i);
    let foods = foodsGroupedDate[date.toISOString()];
    if (foods === undefined) {
      foods = [];
    }
    day_elements.push(<Day key={date.toISOString()} date={date} foodsForDay={foods} />);
  }

  if (isLoading){
    return <Loading/>
  } else {
    return (
      <>
        <div className={Styles.month}>
          <AiOutlineArrowLeft onClick={decreaseMonth} />
          <h2 className={Styles.month_heading}>{`${monthString(monthAndYear.month)} ${
            monthAndYear.year
          }`}</h2>
          <AiOutlineArrowRight onClick={increaseMonth} />
        </div>
        <div className={Styles.calendar}>{day_elements}</div>
      </>
    );
  }
};
export default FoodCalendar;
