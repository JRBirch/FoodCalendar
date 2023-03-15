import {Request, Response} from "express";

const getAllFoods = async(req: Request, res: Response) => {
    console.log("Get All Foods");
    res.status(200).send("Get All Foods");
}

const getSingleFood = async(req: Request, res: Response) => {
    console.log("Get Single Food");
    res.status(200).send("Get Single Food");
}

const createFood = async(req: Request, res: Response) => {
    console.log("Create Food");
    res.status(200).send("Create Food");
}

const editFood = async(req: Request, res: Response) => {
    console.log("Edit Food");
    res.status(200).send("Edit Food");
}

const deleteFood = async(req: Request, res: Response) => {
    console.log("Delete Food");
    res.status(200).send("Delete Food");
}

export {
    getAllFoods,
    createFood,
    getSingleFood,
    editFood,
    deleteFood
}
