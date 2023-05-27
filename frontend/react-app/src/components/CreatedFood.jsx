import { useState } from "react";

// We get the food AND the methods for handling the food state
// This item needed its own component as each component has its own edit state. 
// Setting the edit state (i.e. what is rendered) is specific to the component
// but adjusting the storage is done by FoodList and is therefore handled in the
// FoodList component.

const CreatedFood = ({food, removeItem, updateItem }) => {
  const [localFood, setLocalFood] = useState(food);
  const [editState, setEditState] = useState(false);

  const handleEdit = () => {
    setEditState(true);
  };

  const submitEdit = (e) => {
    e.preventDefault();
    updateItem(localFood);
    setEditState(false)
  };

  const handleChange = (e) => {
    setLocalFood({ ...localFood, [e.target.name]: e.target.value });
  };

  if (editState) {
    // If we are editing we want another form
    return (
      <form onSubmit={submitEdit}>
        <div className="input-food-form">
          <label htmlFor="name" className="form-label">
            Name
          </label>
          <input
            type="text"
            className="form-input"
            value={localFood.name}
            onChange={handleChange}
            id="name"
            name="name"
          />
          <label htmlFor="number" className="form-label">
            Number
          </label>
          <input
            type="text"
            className="form-input"
            value={localFood.number}
            onChange={handleChange}
            id="number"
            name="number"
          />
          <label htmlFor="unitOfMeasure" className="form-label">
            Unit of Measure
          </label>
          <input
            type="text"
            className="form-input"
            value={localFood.unitOfMeasure}
            onChange={handleChange}
            id="unitOfMeasure"
            name="unitOfMeasure"
          />
        </div>
        <button type="submit" className="btn">
          Confirm Edit
        </button>
      </form>
    );
  } else {
    return (
      <li>
        <span id="name">{localFood.name}</span>
        <span id="number">{localFood.number}</span>
        <span id="unitOfMeasure">{localFood.unitOfMeasure}</span>
        <button className="edit btn" onClick={handleEdit}>
          edit
        </button>
        <button className="delete btn" onClick={()=>removeItem(localFood.id)}>
          delete
        </button>
      </li>
    );
  }
};
export default CreatedFood;
