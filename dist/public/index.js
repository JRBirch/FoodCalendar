const submitBtn = document.querySelector(".submit-btn");
const foodName = document.querySelector("#name");
const quantity = document.querySelector("#quantity");
const unitOfMeasure = document.querySelector("#unit-of-measure")
const foodList = document.querySelector(".list-food");

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
        let listEl = document.createElement("li");
        listEl.dataset.id = newFood.data._id;
        listEl.textContent= `${newFood.data.name}, ${newFood.data.quantity} ${newFood.data.unitOfMeasure}`
        foodList.appendChild(listEl);
    } catch (e) {
        console.log(e);
    }
}

// Listing Foods

window.addEventListener('DOMContentLoaded', (e) => {
    const foods = getAllFoods()
})

const getAllFoods = async() => {
    try{
        const foods = await axios.get('/api/v1/foods')
        const foodHtml = foods.data.map((item) => {
            return `<li data-id="${item._id}">${item.name}, ${item.quantity} ${item.unitOfMeasure}</li>`
        }).join("");
        foodList.innerHTML=foodHtml;
    } catch (e) {
        console.log(e)
    }
}

