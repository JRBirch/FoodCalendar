import express from "express";
import { getAllFoods, createFood, getSingleFood, editFood, deleteFood } from "../controllers/foods";
const router = express.Router();

router.route("/").get(getAllFoods);
router.route("/").post(createFood);
router.route("/:id").get(getSingleFood);
router.route("/:id").patch(editFood);
router.route("/:id").delete(deleteFood);

export default router;
