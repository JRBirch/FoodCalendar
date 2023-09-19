import { HydratedDocument, ObjectId, Date } from "mongoose";

interface IFood {
  name: string;
  quantity: number;
  unitOfMeasure: string;
  createdBy: ObjectId;
  date: Date; //YYYY-MM-DD
  category: string;
}

type FoodDoc = HydratedDocument<IFood>;

interface IUser {
  name: string;
  email: string;
  password: string;
  createJWT(): string;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

type UserDoc = HydratedDocument<IUser>;

export { type IFood, type FoodDoc, type IUser, type UserDoc };
