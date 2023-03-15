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
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteFood = exports.editFood = exports.getSingleFood = exports.createFood = exports.getAllFoods = void 0;
const getAllFoods = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Get All Foods");
    res.status(200).send("Get All Foods");
});
exports.getAllFoods = getAllFoods;
const getSingleFood = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Get Single Food");
    res.status(200).send("Get Single Food");
});
exports.getSingleFood = getSingleFood;
const createFood = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Create Food");
    res.status(200).send("Create Food");
});
exports.createFood = createFood;
const editFood = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Edit Food");
    res.status(200).send("Edit Food");
});
exports.editFood = editFood;
const deleteFood = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Delete Food");
    res.status(200).send("Delete Food");
});
exports.deleteFood = deleteFood;
