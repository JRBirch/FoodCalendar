import axios from 'axios';

const submitBtn = <HTMLButtonElement>document.querySelector(".submit-btn");
const foodName = <HTMLInputElement>document.querySelector("#name");
const quantity = <HTMLInputElement>document.querySelector("#quantity");
const unitOfMeasure = <HTMLInputElement>document.querySelector("#unit-of-measure")

submitBtn?.addEventListener('click', (e) => {
    e.preventDefault();
    const food = {name:foodName.value,quantity:quantity.value,unitOfMeasure:unitOfMeasure.value};
    createFood(food);
    // Use axios here to ping the server
})

const createFood = async(food: IFood ) => {
    try{
        const user = await axios.post('/api/v1/foods/', food)
        console.log(`Food was created ${user}`);
    } catch (e) {
        console.log(e);
    }
}

interface IFood {
    name: string;
    quantity: string;
    unitOfMeasure: string;
}

// As we are using commonjs this is not compatible with most browsers i.e. we cannot use require()
// We probably have to compile the frontend typescript code in another directory 
// Then have two compilers running to compile one code to another 