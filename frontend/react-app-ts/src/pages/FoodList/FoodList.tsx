import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import moment from "moment";

import CreatedFood from "../../components/CreatedFood/CreatedFood";

import Styles from "./FoodListStyles.module.css";

// Types being used
enum UnitOfMeasure {
  GRAMS = 'grams', 
  KG = 'kg', 
  UNITS = 'units',
  ML = 'milli litres',
  LITRES = 'litres',
  CUPS =  'cups'
}

type Food = {
  _id: number;
  name: string;
  quantity: number;
  unitOfMeasure: UnitOfMeasure;
}

const initialFoodState: Food = {
  _id: 0,
  name: "",
  quantity: 1,
  unitOfMeasure: UnitOfMeasure.UNITS,
};


const FoodList = () => {
  const [food, setFood] = useState(initialFoodState);
  const [createdFoods, setCreatedFoods] = useState<Food[]>([]);

  const params = useParams()
  const date = moment(params.date, moment.ISO_8601, true).isValid() &&   params.date?new Date(params.date):new Date();

  const updateItem = async (food: Food) => {
    try {
      const resp = await axios.patch(`/api/v1/foods/${food._id}`, {
        name: food.name,
        quantity: food.quantity,
        unitOfMeasure: food.unitOfMeasure,
      });
      const updatedFood = resp.data;
      setCreatedFoods(
        createdFoods.map((item) => {
          if (item._id === food._id) {
            return {
              ...item,
              name: updatedFood.name,
              quantity: updatedFood.quantity,
              unitOfMeasure: updatedFood.unitOfMeasure,
            };
          } else {
            return item;
          }
        })
      );
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const resp = await axios.post("/api/v1/foods/", {
        name: food.name,
        quantity: food.quantity,
        unitOfMeasure: food.unitOfMeasure,
        date: date.toString()
      });
      const createdFood = resp.data;
      setCreatedFoods([...createdFoods, createdFood]);
      setFood(initialFoodState);
    } catch (error) {
      console.log(error);
    }
  };

  const clearFoodList = () => {
    createdFoods.forEach(deleteFood);
    setCreatedFoods([]);
  };

  const removeItem = async (id:number) => {
    try {
      await axios.delete(`/api/v1/foods/${id}`);
      setCreatedFoods(createdFoods.filter((item) => item._id !== id));
    } catch (error) {
      console.log(error);
    }
  };

  const deleteFood = async (food: Food) => {
    try {
      await axios.delete(`/api/v1/foods/${food._id}`);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchFoods();
  }, []);

  const fetchFoods = async () => {
    try {
      const resp = await axios.get("/api/v1/foods", {params:{date: date.toString()}});
      const foods = resp.data;
      setCreatedFoods(foods);
    } catch (error) {
      console.log(error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFood({ ...food, [e.target.name]: e.target.value });
  };

  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

  return (
    <>
      {/* Enter a food item */}
      <div className={Styles.enter_list_food}>
      <form className={Styles.create_food_form} onSubmit={handleSubmit}>
        <div className={Styles.input_food_form}>
          <label htmlFor="name" className={Styles.form_label}>
            Name:
          </label>
          <input
            id="name"
            name="name"
            type="text"
            className={Styles.form_input}
            value={food.name}
            onChange={handleChange}
          />
          <label htmlFor="quantity" className={Styles.form_label}>
            Quantity:
          </label>
          <input
            id="quantity"
            name="quantity"
            type="text"
            className={Styles.form_input}
            value={food.quantity}
            onChange={handleChange}
          />
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
          <button type="submit" className={Styles.button}>
            Submit
          </button>
        </div>
      </form>

      {/* List the foods */}
      <section id={Styles.list_foods_section}>
        <h3 id={Styles.list_foods_section_h3}> {`${days[date.getDay()]} ${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`} </h3>
        <ul className={Styles.food_list}>
          {createdFoods.map((food) => {
            return (
              <CreatedFood
                key={food._id}
                food={food}
                removeItem={removeItem}
                updateItem={updateItem}
              />
            );
          })}
        </ul>
      </section>
      </div>

      {/* Delete All Foods */}
      {createdFoods.length > 0 && (
        <button onClick={clearFoodList} className={Styles.button}>
          Clear All Foods
        </button>
      )}
    </>
  );
};

export type {
  
}
export {
  FoodList,
  type Food,
  UnitOfMeasure
}
