import request from "supertest";
import { StatusCodes } from "http-status-codes";

import app from "../app";
import { connectDB, dropDatabase } from "../db/connect";
import { tearDownDb } from "./common";
import { User } from "../models/user";
import { Food } from "../models/food";
import { FoodDoc, IFood } from "../models/types";
import { UserDoc } from "../models/types";

// Use an agent to be able to save cookies
const supertest = request.agent(app);

beforeAll(async () => {
  return connectDB(`mongodb://localhost:27017/${process.env.TEST_DB}`);
});

describe("Food Endpoints", () => {
  let newUser: UserDoc;
  let newFood: FoodDoc;
  const testDate = new Date("2023-07-20T09:44:24.725Z");

  // Drop and initialise the db after each test, so that each test runs from
  // the same starting point
  beforeEach(async () => {
    return initialiseFoodDb();
  });

  afterEach(async () => {
    return dropDatabase();
  });

  test("User can fetch foods from db", async () => {
    const resFood = await supertest.get("/api/v1/foods");
    expect(resFood.statusCode).toBe(StatusCodes.OK);
    expect(resFood.body.length).toBe(1);
    const apple = resFood.body[0];
    expect(apple.name).toBe("apple");
    expect(apple.quantity).toBe(10);
    expect(apple.unitOfMeasure).toBe("units");
    expect(apple.createdBy).toBe(String(newUser._id));
    expect(apple.date).toBe(testDate.toISOString());
    expect(apple.category).toBe("Breakfast");
  });

  test("User can fetch single food from db", async () => {
    const resFood = await supertest.get(`/api/v1/foods/${newFood._id}`);
    expect(resFood.statusCode).toBe(StatusCodes.OK);
    const apple = resFood.body;
    expect(apple.name).toBe("apple");
    expect(apple.quantity).toBe(10);
    expect(apple.unitOfMeasure).toBe("units");
    expect(apple.createdBy).toBe(String(newUser._id));
    expect(apple.date).toBe(testDate.toISOString());
    expect(apple.category).toBe("Breakfast");
  });

  test("User can create a food for the db", async () => {
    const food = {
      name: "banana",
      quantity: 5,
      unitOfMeasure: "kg",
      date: testDate,
      category: "Lunch",
    };
    const resCreateFood = await supertest.post("/api/v1/foods").send(food);
    expect(resCreateFood.statusCode).toBe(StatusCodes.CREATED);
    const banana = resCreateFood.body;
    expect(banana.name).toBe("banana");
    expect(banana.quantity).toBe(5);
    expect(banana.unitOfMeasure).toBe("kg");
    expect(banana.createdBy).toBe(String(newUser.id));
    expect(banana.date).toBe(testDate.toISOString());
    expect(banana.category).toBe("Lunch");
  });

  test("User can delete food from the db", async () => {
    const resFood = await supertest.delete(`/api/v1/foods/${newFood._id}`);
    expect(resFood.statusCode).toBe(StatusCodes.OK);
    const foodrecords = await Food.find({});
    expect(foodrecords.length).toBe(0);
  });

  test("User can edit food in the db", async () => {
    const updateFood = {
      name: "newApple",
      quantity: 14,
      unitOfMeasure: "grams",
      category: "Dinner",
    };
    const resFood = await supertest.patch(`/api/v1/foods/${newFood._id}`).send(updateFood);
    expect(resFood.statusCode).toBe(StatusCodes.OK);
    const newApple = resFood.body;
    expect(newApple.name).toBe("newApple");
    expect(newApple.quantity).toBe(14);
    expect(newApple.unitOfMeasure).toBe("grams");
    expect(newApple.createdBy).toBe(String(newUser._id));
    expect(newApple.date).toBe(testDate.toISOString());
    expect(newApple.category).toBe("Dinner");
  });

  const initialiseFoodDb = async () => {
    const user = {
      name: "test",
      email: "test@test.com",
      password: "testpassword",
    };
    newUser = await User.create(user);
    const food = {
      name: "apple",
      quantity: 10,
      unitOfMeasure: "units",
      date: testDate,
      category: "Breakfast",
      createdBy: newUser._id,
    };
    newFood = await Food.create(food);
    // Log in the newly created user, the cookie containing the JWT will be saved on the agent
    const resLogin = await supertest.post("/api/v1/auth/login").send(user);
    expect(resLogin.statusCode).toBe(StatusCodes.OK);
    return resLogin;
  };

  // TODO: Thoroughly test the endpoints, producing errors from the db and from the controllers 
  // TODO: Test get all foods endpoint a bit more - as it has from/to/limit behaviour
  // TODO: Do not tear down the connection between every test
});

afterAll(async () => {
  return tearDownDb();
});
