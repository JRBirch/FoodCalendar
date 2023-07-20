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
    const testDate = new Date("2023-07-20T09:44:24.725Z");
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
    // TODO: Thoroughly test the endpoints, producing errors from the db and from the controllers 
    // TODO: Test get all foods endpoint a bit more - as it has from/to/limit behaviour
    // TODO: Do not tear down the connection between every test
});
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    return (0, common_1.tearDownDb)();
}));
