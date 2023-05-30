import { useState, useEffect } from "react";
import axios from "axios";
import CreatedFood from "../components/CreatedFood";

const initialFoodState = {
  _id: "",
  name: "",
  quantity: 1,
  unitOfMeasure: "units",
};

// Have to create the method to handle the data storage in the same place
// that the data is defined. Data that we display must sink up with the data
// we have stored.

const FoodList = () => {
  const [food, setFood] = useState(initialFoodState);
  const [createdFoods, setCreatedFoods] = useState([]);

  const updateItem = async (food) => {
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const resp = await axios.post("/api/v1/foods/", {
        name: food.name,
        quantity: food.quantity,
        unitOfMeasure: food.unitOfMeasure,
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

  const removeItem = async (id) => {
    try {
      await axios.delete(`/api/v1/foods/${id}`);
      setCreatedFoods(createdFoods.filter((item) => item._id !== id));
    } catch (error) {
      console.log(error);
    }
  };

  const deleteFood = async (food) => {
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
      const resp = await axios.get("/api/v1/foods");
      const foods = resp.data;
      setCreatedFoods(foods);
    } catch (error) {
      console.log(error);
    }
  };

  const handleChange = (e) => {
    setFood({ ...food, [e.target.name]: e.target.value });
  };

  return (
    <>
      {/* Enter a food item */}
      <form className="create-food-form" onSubmit={handleSubmit}>
        <div className="input-food-form">
          <label htmlFor="name" className="form-label">
            Name
          </label>
          <input
            type="text"
            className="form-input"
            value={food.name}
            onChange={handleChange}
            id="name"
            name="name"
          />
          <label htmlFor="quantity" className="form-label">
            Quantity
          </label>
          <input
            type="text"
            className="form-input"
            value={food.quantity}
            onChange={handleChange}
            id="quantity"
            name="quantity"
          />
          <label htmlFor="unitOfMeasure" className="form-label">
            Unit of Measure
          </label>
          <input
            type="text"
            className="form-input"
            value={food.unitOfMeasure}
            onChange={handleChange}
            id="unitOfMeasure"
            name="unitOfMeasure"
          />
        </div>
        <button type="submit" className="btn">
          Submit
        </button>
      </form>

      {/* List the foods */}
      <section id="list-foods-section">
        <h3> Monday 30th April </h3>
        <div className="container-food">
          <ul className="list-food">
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
        </div>
      </section>

      {/* Delete All Foods */}
      {createdFoods.length > 0 && (
        <button id="clear-list" onClick={clearFoodList}>
          Clear All Foods
        </button>
      )}
    </>
  );
};
export default FoodList;
