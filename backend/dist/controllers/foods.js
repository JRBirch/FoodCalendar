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
exports.deleteFood = exports.editFood = exports.getSingleFood = exports.createFood = exports.getAllFoods = void 0;
const http_status_codes_1 = require("http-status-codes");
const custom_error_1 = __importDefault(require("../errors/custom_error"));
const food_1 = require("../models/food");
const getAllFoods = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const foods = yield food_1.Food.find({});
    res.status(http_status_codes_1.StatusCodes.OK).json(foods);
});
exports.getAllFoods = getAllFoods;
const getSingleFood = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id: foodId } = req.params;
    if (!(0, food_1.isValidId)(foodId)) {
        throw new custom_error_1.default(`Id ${foodId} is not a valid database Id`, http_status_codes_1.StatusCodes.BAD_REQUEST);
    }
    const food = yield food_1.Food.findById(foodId);
    if (!food) {
        throw new custom_error_1.default(`No food found with id ${foodId}`, http_status_codes_1.StatusCodes.NOT_FOUND);
    }
    res.status(http_status_codes_1.StatusCodes.OK).json(food);
});
exports.getSingleFood = getSingleFood;
const createFood = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const createdFood = yield food_1.Food.create(req.body);
    res.status(http_status_codes_1.StatusCodes.CREATED).json(createdFood);
});
exports.createFood = createFood;
/**
 * Only update the fields passed into the method editFood as it is a PATCH request.
 */
const editFood = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { body: { quantity, unitOfMeasure }, params: { id: foodId } } = req;
    if (!(0, food_1.isValidId)(foodId)) {
        throw new custom_error_1.default(`Id ${foodId} is not a valid database Id`, http_status_codes_1.StatusCodes.BAD_REQUEST);
    }
    if (quantity === '' || unitOfMeasure == '') {
        throw new custom_error_1.default(`Quantity or unit of measure field cannot be empty`, http_status_codes_1.StatusCodes.BAD_REQUEST);
    }
    const food = yield food_1.Food.findByIdAndUpdate({ _id: foodId }, req.body, { new: true, runValidators: true });
    if (!food) {
        throw new custom_error_1.default(`No food found with id ${foodId}`, http_status_codes_1.StatusCodes.NOT_FOUND);
    }
    res.status(http_status_codes_1.StatusCodes.OK).json(food);
});
exports.editFood = editFood;
const deleteFood = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id: foodId } = req.params;
    if (!(0, food_1.isValidId)(foodId)) {
        throw new custom_error_1.default(`Id ${foodId} is not a valid database Id`, http_status_codes_1.StatusCodes.BAD_REQUEST);
    }
    const food = yield food_1.Food.findByIdAndDelete(foodId);
    if (!food) {
        throw new custom_error_1.default(`No food found with id ${foodId}`, http_status_codes_1.StatusCodes.NOT_FOUND);
    }
    res.status(http_status_codes_1.StatusCodes.OK).json(food);
});
exports.deleteFood = deleteFood;
