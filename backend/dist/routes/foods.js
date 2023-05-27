"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const foods_1 = require("../controllers/foods");
const router = express_1.default.Router();
router.route("/").get(foods_1.getAllFoods);
router.route("/").post(foods_1.createFood);
router.route("/:id").get(foods_1.getSingleFood);
router.route("/:id").patch(foods_1.editFood);
router.route("/:id").delete(foods_1.deleteFood);
exports.default = router;
