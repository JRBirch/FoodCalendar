"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const http_status_codes_1 = require("http-status-codes");
const app_1 = __importDefault(require("../app"));
const connect_1 = require("../db/connect");
const common_1 = require("./common");
const user_1 = require("../models/user");
const food_1 = require("../models/food");
// Use an agent to be able to save cookies
const supertest = supertest_1.default.agent(app_1.default);
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    return (0, connect_1.connectDB)(`mongodb://localhost:27017/${process.env.TEST_DB}`);
}));
describe("Food Endpoints", () => {
    let newUser;
    let newFood;
    const testDate = new Date("2023-07-20T23:00:00.000Z");
    // Drop and initialise the db after each test, so that each test runs from
    // the same starting point
    beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
        return initialiseFoodDb();
    }));
    afterEach(() => __awaiter(void 0, void 0, void 0, function* () {
        return (0, connect_1.dropDatabase)();
    }));
    test("User can fetch foods from db", () => __awaiter(void 0, void 0, void 0, function* () {
        const resFood = yield supertest.get("/api/v1/foods");
        expect(resFood.statusCode).toBe(http_status_codes_1.StatusCodes.OK);
        expect(resFood.body.length).toBe(1);
        const apple = resFood.body[0];
        expect(apple.name).toBe("apple");
        expect(apple.quantity).toBe(10);
        expect(apple.unitOfMeasure).toBe("units");
        expect(apple.createdBy).toBe(String(newUser._id));
        expect(apple.date).toBe(testDate.toISOString());
        expect(apple.category).toBe("Breakfast");
    }));
    test("User can fetch foods from db inbetween a date", () => __awaiter(void 0, void 0, void 0, function* () {
        // When we submit the date we submit a date time with the year, month, and day, but the time part is set to 23:00:00.000
        // Therefore the tests should mimic this
        const food = {
            name: "banana",
            quantity: 10,
            unitOfMeasure: "grams",
            date: testDate,
            category: "Lunch",
            createdBy: newUser._id,
        };
        newFood = yield food_1.Food.create(food);
        let from = new Date(2023, 6, 1);
        let to = new Date(2023, 6, 31);
        const currentdate = new Date(testDate.getFullYear(), testDate.getMonth(), testDate.getDate());
        const resFoodOne = yield supertest.get("/api/v1/foods").query({ from, to, limit: 1 });
        expect(resFoodOne.statusCode).toBe(http_status_codes_1.StatusCodes.OK);
        expect(resFoodOne.body[currentdate.toISOString()].length).toBe(1);
        const resFoodTwo = yield supertest.get("/api/v1/foods").query({ from, to, limit: 2 });
        expect(resFoodTwo.statusCode).toBe(http_status_codes_1.StatusCodes.OK);
        expect(resFoodTwo.body[currentdate.toISOString()].length).toBe(2);
        from = new Date(2023, 7, 1);
        to = new Date(2023, 7, 31);
        const resFoodNone = yield supertest.get("/api/v1/foods").query({ from, to, limit: 2 });
        expect(resFoodNone.statusCode).toBe(http_status_codes_1.StatusCodes.OK);
        expect(Object.keys(resFoodNone.body).length).toBe(0);
    }));
    test("User can fetch single food from db", () => __awaiter(void 0, void 0, void 0, function* () {
        const resFood = yield supertest.get(`/api/v1/foods/${newFood._id}`);
        expect(resFood.statusCode).toBe(http_status_codes_1.StatusCodes.OK);
        const apple = resFood.body;
        expect(apple.name).toBe("apple");
        expect(apple.quantity).toBe(10);
        expect(apple.unitOfMeasure).toBe("units");
        expect(apple.createdBy).toBe(String(newUser._id));
        expect(apple.date).toBe(testDate.toISOString());
        expect(apple.category).toBe("Breakfast");
    }));
    test("404 thrown when fetching wrong id from db", () => __awaiter(void 0, void 0, void 0, function* () {
        const resFood = yield supertest.get(`/api/v1/foods/64b0629403776fb50941c423`);
        expect(resFood.statusCode).toBe(http_status_codes_1.StatusCodes.NOT_FOUND);
        expect(JSON.parse(resFood.text).msg).toBe("No food found with id 64b0629403776fb50941c423");
    }));
    test("400 thrown when fetching id with wrong format", () => __awaiter(void 0, void 0, void 0, function* () {
        const resFood = yield supertest.get(`/api/v1/foods/64b0629403776fb50941c42`);
        expect(resFood.statusCode).toBe(http_status_codes_1.StatusCodes.BAD_REQUEST);
        expect(JSON.parse(resFood.text).msg).toBe("Id 64b0629403776fb50941c42 is not a valid database id");
    }));
    test("User can create a food for the db", () => __awaiter(void 0, void 0, void 0, function* () {
        const food = {
            name: "banana",
            quantity: 5,
            unitOfMeasure: "kg",
            date: testDate,
            category: "Lunch",
        };
        const resCreateFood = yield supertest.post("/api/v1/foods").send(food);
        expect(resCreateFood.statusCode).toBe(http_status_codes_1.StatusCodes.CREATED);
        const banana = resCreateFood.body;
        expect(banana.name).toBe("banana");
        expect(banana.quantity).toBe(5);
        expect(banana.unitOfMeasure).toBe("kg");
        expect(banana.createdBy).toBe(String(newUser.id));
        expect(banana.date).toBe(testDate.toISOString());
        expect(banana.category).toBe("Lunch");
    }));
    test("500 thrown when date is not included", () => __awaiter(void 0, void 0, void 0, function* () {
        const food = {
            name: "banana",
            quantity: 5,
            unitOfMeasure: "kg",
            category: "Lunch"
        };
        const resCreatedFood = yield supertest.post("/api/v1/foods").send(food);
        expect(resCreatedFood.statusCode).toBe(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
        expect(JSON.parse(resCreatedFood.text).msg).toBe("Food validation failed: date: Please provide a date");
    }));
    test("User can delete food from the db", () => __awaiter(void 0, void 0, void 0, function* () {
        const resFood = yield supertest.delete(`/api/v1/foods/${newFood._id}`);
        expect(resFood.statusCode).toBe(http_status_codes_1.StatusCodes.OK);
        const foodrecords = yield food_1.Food.find({});
        expect(foodrecords.length).toBe(0);
    }));
    test("User can edit food in the db", () => __awaiter(void 0, void 0, void 0, function* () {
        const updateFood = {
            name: "newApple",
            quantity: 14,
            unitOfMeasure: "grams",
            category: "Dinner",
        };
        const resFood = yield supertest.patch(`/api/v1/foods/${newFood._id}`).send(updateFood);
        expect(resFood.statusCode).toBe(http_status_codes_1.StatusCodes.OK);
        const newApple = resFood.body;
        expect(newApple.name).toBe("newApple");
        expect(newApple.quantity).toBe(14);
        expect(newApple.unitOfMeasure).toBe("grams");
        expect(newApple.createdBy).toBe(String(newUser._id));
        expect(newApple.date).toBe(testDate.toISOString());
        expect(newApple.category).toBe("Dinner");
    }));
    const initialiseFoodDb = () => __awaiter(void 0, void 0, void 0, function* () {
        const user = {
            name: "test",
            email: "test@test.com",
            password: "testpassword",
        };
        newUser = yield user_1.User.create(user);
        const food = {
            name: "apple",
            quantity: 10,
            unitOfMeasure: "units",
            date: testDate,
            category: "Breakfast",
            createdBy: newUser._id,
        };
        newFood = yield food_1.Food.create(food);
        // Log in the newly created user, the cookie containing the JWT will be saved on the agent
        const resLogin = yield supertest.post("/api/v1/auth/login").send(user);
        expect(resLogin.statusCode).toBe(http_status_codes_1.StatusCodes.OK);
        return resLogin;
    });
});
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    return (0, common_1.tearDownDb)();
}));
