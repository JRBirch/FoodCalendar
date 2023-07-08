import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import moment from "moment";

import Loading from "../../components/Loading/Loading";
import FoodCategory from "../../components/FoodCategory/FoodCategory";
import { dayString, monthString } from "../../utility/date";

import Styles from "./FoodListStyles.module.css";

// Types being used
enum UnitOfMeasure {
  GRAMS = "grams",
  KG = "kg",
  UNITS = "units",
  ML = "milli litres",
  LITRES = "litres",
  CUPS = "cups",
}

type Food = {
  _id: number;
  name: string;
  quantity: number;
  unitOfMeasure: UnitOfMeasure;
  category: string | undefined;
  createdBy: string;
  date: string;
};

const initialFoodState: Food = {
  _id: 0,
  name: "",
  quantity: 1,
  unitOfMeasure: UnitOfMeasure.UNITS,
  category: "",
  createdBy: "",
  date: "",
};

type FoodsGroupedByCategory = { [category: string]: Food[] };

const FoodList = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [food, setFood] = useState(initialFoodState);
  const [groupedFoods, setGroupedFoods] = useState<FoodsGroupedByCategory>({});

  const params = useParams();
  const date =
    moment(params.date, moment.ISO_8601, true).isValid() && params.date
      ? new Date(params.date)
      : new Date();

  const updateItem = async (category: string, food: Food) => {
    try {
      if (!food.category) return;
      await axios.patch(`/api/v1/foods/${food._id}`, {
        name: food.name,
        quantity: food.quantity,
        unitOfMeasure: food.unitOfMeasure,
        category: category,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (!food.name) return;
      let category = food.category;
      if (typeof category === "undefined") return;
      if (!food.category) {
        category = "no category";
      }
      const resp = await axios.post("/api/v1/foods/", {
        name: food.name,
        quantity: food.quantity,
        unitOfMeasure: food.unitOfMeasure,
        date: date.toString(),
        category: category,
      });
      const createdFood = resp.data;
      let newGroupedFoods: FoodsGroupedByCategory = { ...groupedFoods };
      if (groupedFoods[category]) {
        newGroupedFoods[category] = [...groupedFoods[category], createdFood];
      } else {
        newGroupedFoods[category] = [createdFood];
      }
      setGroupedFoods(newGroupedFoods);
      setFood(initialFoodState);
    } catch (error) {
      console.log(error);
    }
  };

  const clearFoodList = () => {
    Object.keys(groupedFoods).forEach((category) => {
      groupedFoods[category].forEach((food) => deleteFood(food));
    });
    setGroupedFoods({});
  };

  const deleteFood = async (food: Food) => {
    try {
      await axios.delete(`/api/v1/foods/${food._id}`);
    } catch (error) {
      console.log(error);
    }
  };

  const removeItem = async (category: string, food: Food) => {
    try {
      await deleteFood(food);
      const foodsList = groupedFoods[category];
      const newFoodsList = foodsList.filter((item) => item._id !== food._id);
      const newGroupedFoods = { ...groupedFoods };
      newGroupedFoods[category] = newFoodsList;
      setGroupedFoods(newGroupedFoods);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchFoods = async () => {
    setIsLoading(true);
    try {
      const resp = await axios.get("/api/v1/foods", { params: { date: date.toString() } });
      const foods = resp.data;
      const newGroupedFoods = foods.reduce(
        (object: { [category: string]: Food[] }, fetchedFoods: Food) => {
          let field = "no category";
          if (fetchedFoods.category !== undefined) {
            field = fetchedFoods.category;
          }
          object[field] = object[field] || [];
          object[field].push(fetchedFoods);
          return object;
        },
        {}
      );
      setGroupedFoods(newGroupedFoods);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFood({ ...food, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    fetchFoods();
  }, []);

  if (isLoading) {
    return <Loading />;
  } else {
    return (
      <>
        {/* Enter a food item */}
        <div className={Styles.enter_list_food}>
          <form className={Styles.create_food_form} onSubmit={handleSubmit}>
            <div className={Styles.input_food_form}>
              <div className={Styles.input}>
                <label htmlFor="name" className={Styles.form_label}>
                  Name:
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  className={`${Styles.form_input} ${Styles.name_input}`}
                  value={food.name}
                  onChange={handleChange}
                />
              </div>
              <div className={Styles.input}>
                <label htmlFor="quantity" className={Styles.form_label}>
                  Quantity:
                </label>
                <input
                  id="quantity"
                  name="quantity"
                  type="text"
                  className={`${Styles.form_input} ${Styles.quantity_input}`}
                  value={food.quantity}
                  onChange={handleChange}
                />
              </div>
              <div className={Styles.input}>
                <label htmlFor="unitOfMeasure" className={Styles.form_label}>
                  Unit of Measure:
                </label>
                <select
                  id="unitOfMeasure"
                  name="unitOfMeasure"
                  value={food.unitOfMeasure}
                  onChange={handleChange}
                  className={Styles.form_select}
                >
                  <option value="grams">grams</option>
                  <option value="kg">kg</option>
                  <option value="units">units</option>
                  <option value="milli litres">milli litres</option>
                  <option value="litres">litres</option>
                  <option value="cups">cups</option>
                </select>
              </div>
              <div className={Styles.input}>
                <label htmlFor="Category" className={Styles.form_label}>
                  Category:
                </label>
                <input
                  id="category"
                  name="category"
                  type="text"
                  className={`${Styles.form_input} ${Styles.name_input}`}
                  value={food.category}
                  onChange={handleChange}
                />
              </div>
              <button type="submit" className={Styles.button}>
                Submit
              </button>
            </div>
          </form>

          {/* List the foods */}
          <section id={Styles.list_foods_section}>
            <h3 id={Styles.list_foods_section_h3}>
              {" "}
              {`${dayString(date.getDay())} ${date.getDate()} ${monthString(
                date.getMonth()
              )} ${date.getFullYear()}`}{" "}
            </h3>
            <ul className={Styles.category_list}>
              {/* List the categories */}
              {Object.keys(groupedFoods).map((category, index) => {
                return (
                  <FoodCategory
                    key={index}
                    categoryName={category}
                    foods={groupedFoods[category]}
                    removeItem={removeItem}
                    updateItem={updateItem}
                  />
                );
              })}
            </ul>
          </section>
        </div>

        {/* Delete All Foods */}
        {Object.keys(groupedFoods).length > 0 && (
          <button onClick={clearFoodList} className={Styles.button}>
            Clear All Foods
          </button>
        )}
      </>
    );
  }
};

export type {};
export { FoodList, type Food, UnitOfMeasure };
