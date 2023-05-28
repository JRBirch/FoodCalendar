import { useState, useEffect } from "react";
import CreatedFood from "../components/CreatedFood"

// Remove this once we start fetching data from the server
let id_count = 1

const initialFoodState = {
  id:"",
  name: "",
  number: 1,
  unitOfMeasure: "Units",
}

// Have to create the method to handle the data storage in the same place
// that the data is defined. Data that we display must sink up with the data
// we have stored.

const FoodList = () => {
  const [food, setFood] = useState(initialFoodState);
  const [createdFoods, setCreatedFoods] = useState([])

  const removeItem = (id) => {
    // This where the ping to the backend will go to delete the item
    // If request fails do not cancel the item
    setCreatedFoods(createdFoods.filter((item) => item.id !== id));
  };

  const updateItem = (food) =>{
    // This is where the ping to the backend will go to update the item
    // If request fails do not update the item
    setCreatedFoods(
      createdFoods.map((item) => {
        if (item.id === food.id) {
          return { ...item, name:food.name, number:food.number, unitOfMeasure:food.unitOfMeasure };
        } else {
          return item;
        }
      }))
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    // This is where we need to hit the server to create an item
    // After we hit the server we get a return object which will be the newly created food item
    // If request fails do not create the item
    const newId = id_count + 1
    setCreatedFoods([...createdFoods, {...food, id:newId}])
    id_count = newId;
    setFood(initialFoodState);
  }

  const handleChange = (e) =>{
    setFood({...food, [e.target.name]: e.target.value})
  }

  const clearFoodList = () => {
    // This is where we need to hit the server to delete all items
    setCreatedFoods([])
  }

  useEffect(()=>{
    // This is where we hit the server to fetch all the items in the list
  }, [])

  return (
    <>
      {/* Enter a food */}
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
          <label htmlFor="number" className="form-label">
            Number
          </label>
          <input
            type="text"
            className="form-input"
            value={food.number}
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
              {createdFoods.map((food)=>{
                // Set up key as id when we hit the server
                return <CreatedFood key={food.id} food={food} removeItem={removeItem} updateItem={updateItem}/>
              })}
            </ul>
          </div>
        </section>
        
        {/* Delete All Foods */}
        {createdFoods.length>0 && <button id="clear-list" onClick={clearFoodList}>
          Clear All Foods
        </button>}
      
    </>
  );
};
export default FoodList;
