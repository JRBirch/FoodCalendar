"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isValidId = exports.Food = void 0;
const mongoose_1 = require("mongoose");
const foodSchema = new mongoose_1.Schema({
    name: { type: String, required: [true, "Please provide name of food"] },
    quantity: {
        type: Number,
        required: [true, "Please provide the quantity"],
        default: 1,
    },
    unitOfMeasure: {
        type: String,
        required: [true, "Please enter the unit of measure"],
        enum: ["grams", "kg", "units", "milli litres", "litres", "cups"],
        default: "units",
    },
    createdBy: {
        type: mongoose_1.Types.ObjectId,
        ref: "User",
        required: [true, "Please provide a user"]
    }
});
const isValidId = (id) => {
    return (0, mongoose_1.isValidObjectId)(id);
};
exports.isValidId = isValidId;
const Food = (0, mongoose_1.model)("Food", foodSchema);
exports.Food = Food;
