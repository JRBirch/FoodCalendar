const submitBtn = document.querySelector(".submit-btn");
const foodName = document.querySelector("#name");
const quantity = document.querySelector("#quantity");
const unitOfMeasure = document.querySelector("#unit-of-measure");
const foodList = document.querySelector(".list-food");
const deleteAllBtn = document.querySelector("#delete-all-btn");

// Creating Food 

submitBtn.addEventListener('click', (e) => {
    e.preventDefault();
    const food = {name:foodName.value,quantity:quantity.value,unitOfMeasure:unitOfMeasure.value};
    createFood(food);
})

// We add functionality to send a request to the server and create our food item
const createFood = async(food) => {
    try{
        const newFood = await axios.post('/api/v1/foods/', food)
        // Add all foods to the list
        createFoodElement(newFood.data); 
    } catch (e) {
        console.log(e);
    }
}

// Listing Foods

window.addEventListener('DOMContentLoaded', () => {
    getAllFoods()
})

const getAllFoods = async() => {
    try{
        const foods = await axios.get('/api/v1/foods');
        foods.data.forEach(createFoodElement);
    } catch (e) {
        console.log(e);
    }
}

/**
 * Create a food element in the food list, with a delete button
 * @param {*} food - A mongodb record 
 */
const createFoodElement = (food) => {
    const listEl = document.createElement("li");
    listEl.dataset.id = food._id;
    listEl.textContent= `${food.name}, ${food.quantity} ${food.unitOfMeasure}`;

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.classList.add("delete-single-btn");
    deleteBtn.addEventListener('click', () => {
        deleteFood(deleteBtn.parentElement);
    })

    listEl.appendChild(deleteBtn);
    foodList.appendChild(listEl);
}

// Deleting Foods 

deleteAllBtn.addEventListener('click', () => {
    // Get all child elements and convert to an array so they can  be iterated over
    // foodList.children returns a HTMLCollection
    const foods = Array.from(foodList.children)
    foods.forEach(deleteFood)
})

const deleteFood = async(food) => {
    try{
        await axios.delete(`/api/v1/foods/${food.dataset.id}`);
        foodList.removeChild(food);
    } catch (e) {
        console.log(e)
    }
}