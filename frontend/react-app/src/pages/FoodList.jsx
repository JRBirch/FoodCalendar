import { useState } from "react";

const initialFoodState = {
  name: "",
  number: 0,
  unitOfMeasure: "Units",
}

const FoodList = () => {
  const [food, setFood] = useState(initialFoodState);
  const [createdFoods, setCreatedFoods] = useState([])

  const handleSubmit = (e) => {
    e.preventDefault();
    // This is where we need to hit the server
    // After we hit the server we get a return object which will be the newly created food item
    setCreatedFoods([...createdFoods, food])
  }

  const handleChange = (e) =>{
    setFood({...food, [e.target.name]: e.target.value})
  }

  return (
    <>
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

        <section id="list-foods-section">
          <h3> Monday 30th April </h3>
          <div className="container-food">
            <ul className="list-food">
              {createdFoods.map((food,index)=>{
                return <li key={index}>
                  <span id="name">{food.name}</span>
                  <span id="number">{food.number}</span>
                  <span id="unitOfMeasure">{food.unitOfMeasure}</span>
                </li>
              })}
            </ul>
          </div>
        </section>
      </form>
    </>
  );
};
export default FoodList;
