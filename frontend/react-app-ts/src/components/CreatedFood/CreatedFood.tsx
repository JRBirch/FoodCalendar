import React, { useState, useEffect, useRef} from "react";

import { Food } from "../../pages/FoodList/FoodList";
import { useDragging } from "../../custom_hooks/useDragging";

import Styles from "./CreatedFoodStyles.module.css";

// We get the food AND the methods for handling the food state
// This item needed its own component as each component has its own edit state.
// Setting the edit state (i.e. what is rendered) is specific to the component
// but adjusting the storage is done by FoodList and is therefore handled in the
// FoodList component.

type CreatedFood = {
  food: Food;
  removeItem: (category: string, food: Food) => void;
  updateItem: (category: string, food: Food, skipSetMethod?: boolean) => void;
};

const Siblings = (element: Element, name: string): HTMLElement | undefined => {
  if (!element.parentElement) return;
  return [...element.parentElement.children].filter(
    (child) => child.nodeName == name
  )[0] as HTMLElement;
};

const CreatedFood = ({ food, removeItem, updateItem }: CreatedFood) => {

  const removeButtons = () => {
    if (!liref.current) return;
    const newCategoryHeadingElement = Siblings(liref.current, "H2");
    if (!newCategoryHeadingElement) return;
    const newCategoryName = newCategoryHeadingElement.innerText.toLowerCase();
    if (newCategoryName == food.category) return;
    const buttons = liref.current.querySelector(".buttons");
    if (!buttons) return;
    liref.current.removeChild(buttons);
  };

  const [localFood, setLocalFood] = useState(food);
  const [editState, setEditState] = useState(false);
  const [liref, x, y, isDragging] = useDragging(removeButtons);
  const firstUpdate = useRef(true);

  const handleEdit = () => {
    setEditState(true);
  };

  const submitEdit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!localFood.category) return;
    setEditState(false);
    updateItem(localFood.category, localFood);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setLocalFood({ ...localFood, [e.target.name]: e.target.value });
  };

  /**
   * Update the food category on the server. Change the food category locally. This is done after the 
   * the object is down being dragged.
   */
  useEffect(() => {
    if (firstUpdate.current) {
      firstUpdate.current = false;
      return;
    }
    if (isDragging) return;
    if (!liref.current) return;
    const newCategoryHeadingElement = Siblings(liref.current, "H2");
    if (!newCategoryHeadingElement) return;
    const newCategoryName = newCategoryHeadingElement.innerText;
    updateItem(newCategoryName.toLowerCase(), localFood);
    setLocalFood({ ...localFood, category: newCategoryName.toLowerCase() });
  }, [isDragging]);

  if (editState) {
    // If we are editing we want another form
    return (
      <form onSubmit={submitEdit} className={Styles.created_food}>
        <div className={Styles.input_food_form}>
          <input
            type="text"
            className={`${Styles.form_input} ${Styles.name_input}`}
            value={localFood.name}
            onChange={handleChange}
            id="name"
            name="name"
          />
          <input
            type="text"
            className={`${Styles.form_input} ${Styles.quantity_input}`}
            value={localFood.quantity}
            onChange={handleChange}
            id="quantity"
            name="quantity"
          />
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
      <li
        className={Styles.created_food}
        ref={liref}
        style={{
          position: isDragging ? "absolute" : undefined,
          left: isDragging ? x : undefined,
          top: isDragging ? y : undefined,
          backgroundColor: isDragging ? "red" : "white",
        }}
      >
        <div>
          {localFood.name} {localFood.quantity} {localFood.unitOfMeasure}
        </div>
        <div className="buttons">
          <button className={Styles.button} onClick={handleEdit}>
            edit
          </button>
          <button
            className={Styles.button}
            onClick={() => {
              if (!localFood.category) return;
              return removeItem(localFood.category, localFood);
            }}
          >
            delete
          </button>
        </div>
      </li>
    );
  }
};
export default CreatedFood;
