import { useState } from "react";
import Styles from "./CreatedFoodStyles.module.css";

import {Food} from "../../pages/FoodList/FoodList"

// We get the food AND the methods for handling the food state
// This item needed its own component as each component has its own edit state.
// Setting the edit state (i.e. what is rendered) is specific to the component
// but adjusting the storage is done by FoodList and is therefore handled in the
// FoodList component.

type CreatedFood = {
 food: Food,
 removeItem: (id: number) => void;
 updateItem: (food: Food) => void;
}

const CreatedFood = ({ food, removeItem, updateItem } : CreatedFood) => {
  const [localFood, setLocalFood] = useState(food);
  const [editState, setEditState] = useState(false);

  const handleEdit = () => {
    setEditState(true);
  };

  const submitEdit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    updateItem(localFood);
    setEditState(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setLocalFood({ ...localFood, [e.target.name]: e.target.value });
  };

  if (editState) {
    // If we are editing we want another form
    return (
      <form onSubmit={submitEdit} className={Styles.created_food}>
        <div className={Styles.input_food_form}>
          {/* <label htmlFor="name" className="form-label">
            Name
          </label> */}
          <input
            type="text"
            className={`${Styles.form_input} ${Styles.name_input}`}
            value={localFood.name}
            onChange={handleChange}
            id="name"
            name="name"
          />
          {/* <label htmlFor="quantity" className="form-label">
            Quantity
          </label> */}
          <input
            type="text"
            className={`${Styles.form_input} ${Styles.quantity_input}`}
            value={localFood.quantity}
            onChange={handleChange}
            id="quantity"
            name="quantity"
          />
          {/* <label htmlFor="unitOfMeasure" className="form-label">
            Unit of Measure
          </label> */}
          <select
            name="unitOfMeasure"
            id="unitOfMeasure"
            value={localFood.unitOfMeasure}
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
            Confirm Edit
          </button>
        </div>
      </form>
    );
  } else {
    return (
      <li className={Styles.created_food}>
        <div>
        {localFood.name} {localFood.quantity} {localFood.unitOfMeasure}
        </div>
        <div>
          <button className={Styles.button} onClick={handleEdit}>
            edit
          </button>
          <button
            className={Styles.button}
            onClick={() => removeItem(localFood._id)}
          >
            delete
          </button>
        </div>
        
      </li>
    );
  }
};
export default CreatedFood;
