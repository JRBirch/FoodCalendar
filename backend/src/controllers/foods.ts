import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import CustomError from "../errors/custom_error";
import { IFood, Food, FoodDoc, isValidId } from "../models/food";


// TODO: Add better typing for the incoming requests, then can use these types in the frontend as well

// When fetching all the foods the date goes in the query because we want to return 
// an empty string if nothing is found.

type Searchquery = {
  createdBy: string,
  date?: string | { $gte: string, $lte: string,},
}
const getAllFoods = async (req: Request, res: Response<FoodDoc[]>) => {
  const query: Searchquery = {createdBy: req.user.userId}
  if (req.query.date){
    query.date = String(req.query.date)
  }
  if (req.query.from && req.query.to){
    query.date = { $gte: String(req.query.from), $lte: String(req.query.to),}
  }
  let foods = Food.find(query);
  if (req.query.limit){
    foods = foods.limit(Number(req.query.limit))
  }
  const result = await foods;
  res.status(StatusCodes.OK).json(result);
};

// We do not need to add the date information in here, as we are already searching for the food by
// it's unique identifier
const getSingleFood = async (req: Request, res: Response<FoodDoc>) => {
  const {
    user: { userId },
    params: { id: foodId },
  } = req;
  if (!isValidId(foodId)) {
    throw new CustomError(`Id ${foodId} is not a valid database Id`, StatusCodes.BAD_REQUEST);
  }
  const food = await Food.findOne({
    _id: foodId,
    createdBy: userId,
  });
  if (!food) {
    throw new CustomError(`No food found with id ${foodId}`, StatusCodes.NOT_FOUND);
  }
  res.status(StatusCodes.OK).json(food);
};

// When creating a food the date should go in the request body
const createFood = async (req: Request<undefined, undefined, IFood>, res: Response<FoodDoc>) => {
  const createdFood: FoodDoc = await Food.create({ ...req.body, createdBy: req.user.userId});
  res.status(StatusCodes.CREATED).json(createdFood);
};

/**
 * Only update the fields passed into the method editFood as it is a PATCH request.
 * Here we do not need the date information as we are passing in the food by its unique identifier 
 */
const editFood = async (req: Request, res: Response<FoodDoc>) => {
  const {
    body: { quantity, unitOfMeasure },
    params: { id: foodId },
    user: { userId },
  } = req;
  if (!isValidId(foodId)) {
    throw new CustomError(`Id ${foodId} is not a valid database Id`, StatusCodes.BAD_REQUEST);
  }
  if (quantity === "" || unitOfMeasure == "") {
    throw new CustomError(
      `Quantity or unit of measure field cannot be empty`,
      StatusCodes.BAD_REQUEST
    );
  }

  const food = await Food.findOneAndUpdate({ _id: foodId, createdBy: userId}, req.body, {
    new: true,
    runValidators: true,
  });
  if (!food) {
    throw new CustomError(`No food found with id ${foodId}`, StatusCodes.NOT_FOUND);
  }

  res.status(StatusCodes.OK).json(food);
};

// Here we do not need date information as we are already searching for the food by it's
// unique identiifer.
const deleteFood = async (req: Request, res: Response<FoodDoc>) => {
  const {
    params: { id: foodId },
    user: { userId },
  } = req;
  if (!isValidId(foodId)) {
    throw new CustomError(`Id ${foodId} is not a valid database Id`, StatusCodes.BAD_REQUEST);
  }

  const food = await Food.findOneAndDelete({
    _id: foodId,
    createdBy: userId,
  });
  if (!food) {
    throw new CustomError(`No food found with id ${foodId}`, StatusCodes.NOT_FOUND);
  }

  res.status(StatusCodes.OK).json(food);
};

export { getAllFoods, createFood, getSingleFood, editFood, deleteFood };
