import { Schema, model, isValidObjectId, HydratedDocument, ObjectId, Types, Date } from "mongoose";

interface IFood {
  name: string;
  quantity: number;
  unitOfMeasure: string;
  createdBy: ObjectId;
  date: Date;  //YYYY-MM-DD
  category: string;
}

type FoodDoc = HydratedDocument<IFood>;

const foodSchema = new Schema<IFood>({
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
    type: Types.ObjectId, 
    ref: "User",
    required: [true, "Please provide a user"]
  },
  date: {
    type: Date,
    required: [true, "Please provide a date"]
  },
  category: {
    type: String,
    required: false,
  }
});

const isValidId = (id: string): boolean => {
  return isValidObjectId(id);
};

const Food = model<IFood>("Food", foodSchema);

export { IFood, Food, FoodDoc, isValidId };
