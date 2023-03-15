import {Request, Response} from "express";
import {StatusCodes} from "http-status-codes";

const getAllFoods = async(req: Request, res: Response) => {
    console.log("Get All Foods");
    res.status(StatusCodes.OK).send("Get All Foods");
}

const getSingleFood = async(req: Request, res: Response) => {
    console.log("Get Single Food");
    res.status(StatusCodes.OK).send("Get Single Food");
}

const createFood = async(req: Request, res: Response) => {
    console.log("Create Food");
    res.status(StatusCodes.CREATED).send("Create Food");
}

const editFood = async(req: Request, res: Response) => {
    console.log("Edit Food");
    res.status(StatusCodes.OK).send("Edit Food");
}

const deleteFood = async(req: Request, res: Response) => {
    console.log("Delete Food");
    res.status(StatusCodes.OK).send("Delete Food");
}

export {
    getAllFoods,
    createFood,
    getSingleFood,
    editFood,
    deleteFood
}
