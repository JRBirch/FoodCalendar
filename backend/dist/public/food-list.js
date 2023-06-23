"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const submitBtn = document.querySelector(".submit-btn");
const foodName = document.querySelector("#name");
const quantity = document.querySelector("#quantity");
const unitOfMeasure = document.querySelector("#unit-of-measure");
submitBtn === null || submitBtn === void 0 ? void 0 : submitBtn.addEventListener("click", (e) => {
    e.preventDefault();
    const food = {
        name: foodName.value,
        quantity: quantity.value,
        unitOfMeasure: unitOfMeasure.value,
    };
    createFood(food);
    // Use axios here to ping the server
});
const createFood = (food) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield axios_1.default.post("/api/v1/foods/", food);
        console.log(`Food was created ${user}`);
    }
    catch (e) {
        console.log(e);
    }
});
// As we are using commonjs this is not compatible with most browsers i.e. we cannot use require()
// We probably have to compile the frontend typescript code in another directory
// Then have two compilers running to compile one code to another
