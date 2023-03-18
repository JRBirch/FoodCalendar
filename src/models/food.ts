import { Schema, model } from "mongoose";

interface IFood {
    name: string;
    quantity: number;
    unitOfMeasure: string;
}

const foodSchema = new Schema<IFood>({
    name: { type: String, required: [true, "Please provide name of food"] },
    quantity: { type: Number, required: [true, "Please provide the quantity"], default: 1 },
    unitOfMeasure: { type: String, required: [true, "Please enter the unit of measure"], enum: ['grams', 'kg', 'units', 'milli litres', 'litres', 'cups'], default: 'units' }
});

const Food = model<IFood>('Food', foodSchema);

export {IFood, Food};
