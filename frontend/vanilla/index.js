// Javascript file that uses axios to send requests to the backend server to CRUD items in the food list

const submitBtn = document.querySelector(".submit-btn");
const foodName = document.querySelector("#name");
const quantity = document.querySelector("#quantity");
const unitOfMeasure = document.querySelector("#unit-of-measure");
const foodList = document.querySelector(".list-food");
const deleteAllBtn = document.querySelector("#delete-all-btn");

// Global Edit Variable
let editFlag = false
let id = 0;

////// CREATING AND EDITING FOOD

submitBtn.addEventListener('click', (e) => {
    e.preventDefault();
    const food = {name:foodName.value,quantity:quantity.value,unitOfMeasure:unitOfMeasure.value};
    if (editFlag){
        editFood(food);
    } else {
        createFood(food);
    }
})

const createFood = async(food) => {
    try{
        const newFood = await axios.post('/api/v1/foods/', food)
        createFoodElement(newFood.data); 
    } catch (e) {
        console.log(e);
    }
}

/**
 * Update the food object in the database and update the food item in the list of foods
 * @param {*} foodObj - The food data type
 */
const editFood = async(foodObj) => {
    try {
        const updatedFood = await axios.patch(`/api/v1/foods/${id}`, foodObj)
        let foods = Array.from(foodList.children)
        foods = foods.filter((item) => {
            return item.dataset.id === updatedFood.data._id;
        })
        if (foods || food.length === 1) {
            foodList.removeChild(foods[0]);
            createFoodElement(updatedFood.data);
        };
        _reset_edit_variables();
        
    } catch (e) {
        console.log(e);
    }
}

////// LISTING FOOD

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
 * Create a food element in the food list, with a delete button and an edit button.
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

    const editBtn = document.createElement("button");
    editBtn.textContent = "Edit";
    editBtn.classList.add("edit-single-btn");
    editBtn.addEventListener('click', () => {
        _set_edit_variables(food);
    })

    listEl.appendChild(editBtn);
    listEl.appendChild(deleteBtn);
    foodList.appendChild(listEl);
}

////// DELETING FOOD 

/** 
 * Get all child elements and convert to an array so they can 
 * be iterated over foodList.children returns a HTMLCollection 
 */
deleteAllBtn.addEventListener('click', () => {
    const foods = Array.from(foodList.children)
    foods.forEach(deleteFood)
})

const deleteFood = async(foodElement) => {
    try{
        await axios.delete(`/api/v1/foods/${foodElement.dataset.id}`);
        foodList.removeChild(foodElement);
    } catch (e) {
        console.log(e)
    }
}

////// UPDATING GLOBAL VARIABLES 

/**
 * Reset the webpage back for creating, the global variables should only be changed 
 * through this function and _set_edit_variables.
 */
const _reset_edit_variables = () => {
    editFlag = false;
    submitBtn.innerHTML = "Submit";
    id = 0;
    foodName.value = "";
    quantity.value = "";
    unitOfMeasure.value = "";
}

/**
 * Set the webpage up for editing, the global variables should only be changed through
 * this function and _reset_edit_variables.
 * @param {} food - Mongo DB record
 */
const _set_edit_variables = (food) => {
    editFlag = true;
    submitBtn.innerHTML = "Confirm Edit";
    id = food._id;
    foodName.value = food.name;
    quantity.value = food.quantity;
    unitOfMeasure.value = food.unitOfMeasure;
}