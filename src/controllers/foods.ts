import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import CustomError from "../errors/custom_error";
import { IFood, Food } from "../models/food";
import { Document } from "mongoose";

const getAllFoods = async (req: Request, res: Response) => {
    console.log("Get All Foods");
    throw new Error("This is a server error");
    res.status(StatusCodes.OK).send("Get All Foods");
};

const getSingleFood = async (req: Request, res: Response) => {
    console.log("Get Single Food");
    throw new CustomError("This is a custom error", StatusCodes.BAD_REQUEST);
    res.status(StatusCodes.OK).send("Get Single Food");
};

const createFood = async (req: Request<undefined,undefined,IFood>, res: Response<Document<any,any,IFood>>) => {
    const {name, quantity, unitOfMeasure} = req.body;
    let food: IFood = {name, quantity, unitOfMeasure};
    const createdFood: Document<any,any,IFood>  = await Food.create(food);
    res.status(StatusCodes.CREATED).json(createdFood);
};

const editFood = async (req: Request, res: Response) => {
    console.log("Edit Food");
    res.status(StatusCodes.OK).send("Edit Food");
};

const deleteFood = async (req: Request, res: Response) => {
    console.log("Delete Food");
    res.status(StatusCodes.OK).send("Delete Food");
};

export {
    getAllFoods,
    createFood,
    getSingleFood,
    editFood,
    deleteFood
};
