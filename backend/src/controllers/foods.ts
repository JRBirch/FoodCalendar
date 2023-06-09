import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import CustomError from "../errors/custom_error";
import { IFood, Food, FoodDoc, isValidId } from "../models/food";

const getAllFoods = async (req: Request, res: Response<FoodDoc[]>) => {
  const foods = await Food.find({ createdBy: req.user.userId });
  res.status(StatusCodes.OK).json(foods);
};

const getSingleFood = async (req: Request, res: Response<FoodDoc>) => {
  // const { id: foodId } = req.params;
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

const createFood = async (req: Request<undefined, undefined, IFood>, res: Response<FoodDoc>) => {
  const createdFood: FoodDoc = await Food.create({ ...req.body, createdBy: req.user.userId });
  res.status(StatusCodes.CREATED).json(createdFood);
};

/**
 * Only update the fields passed into the method editFood as it is a PATCH request.
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

  const food = await Food.findByIdAndUpdate({ _id: foodId, createdBy: userId }, req.body, {
    new: true,
    runValidators: true,
  });
  if (!food) {
    throw new CustomError(`No food found with id ${foodId}`, StatusCodes.NOT_FOUND);
  }

  res.status(StatusCodes.OK).json(food);
};

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
