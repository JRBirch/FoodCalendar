import { FoodDoc } from "../models/types";

// Auth

type Login = {
  email: string;
  password: string;
};

type Register = {
  name: string;
  email: string;
  password: string;
};

// Food

type RecordsGroupedByDate = { [ISOdate: string]: FoodDoc[] };

export {type Login, type Register, type RecordsGroupedByDate };
