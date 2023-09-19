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
  const testDate = new Date("2023-07-20T23:00:00.000Z");

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

  test("User can fetch foods from db inbetween a date", async() => {
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
    newFood = await Food.create(food);

    let from = new Date(2023, 6, 1)
    let to = new Date(2023, 6, 31)
    const currentdate = new Date(testDate.getFullYear(), testDate.getMonth(), testDate.getDate())
    const resFoodOne = await supertest.get("/api/v1/foods").query({from, to, limit: 1});
    expect(resFoodOne.statusCode).toBe(StatusCodes.OK);
    expect(resFoodOne.body[currentdate.toISOString()].length).toBe(1);
    const resFoodTwo = await supertest.get("/api/v1/foods").query({from, to, limit: 2});
    expect(resFoodTwo.statusCode).toBe(StatusCodes.OK);
    expect(resFoodTwo.body[currentdate.toISOString()].length).toBe(2);
    
    from = new Date(2023,7,1)
    to = new Date(2023,7,31)
    const resFoodNone = await supertest.get("/api/v1/foods").query({from, to, limit: 2});
    expect(resFoodNone.statusCode).toBe(StatusCodes.OK);
    expect(Object.keys(resFoodNone.body).length).toBe(0);
  })

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

  test("404 thrown when fetching wrong id from db", async()=>{
    const resFood = await supertest.get(`/api/v1/foods/64b0629403776fb50941c423`);
    expect(resFood.statusCode).toBe(StatusCodes.NOT_FOUND);
    expect(JSON.parse(resFood.text).msg).toBe("No food found with id 64b0629403776fb50941c423");
  })

  test("400 thrown when fetching id with wrong format", async()=>{
    const resFood = await supertest.get(`/api/v1/foods/64b0629403776fb50941c42`);
    expect(resFood.statusCode).toBe(StatusCodes.BAD_REQUEST);
    expect(JSON.parse(resFood.text).msg).toBe("Id 64b0629403776fb50941c42 is not a valid database id");
  })

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

  test("500 thrown when date is not included", async() => {
    const food = {
      name: "banana",
      quantity: 5,
      unitOfMeasure: "kg",
      category: "Lunch"
    }
    const resCreatedFood = await supertest.post("/api/v1/foods").send(food);
    expect(resCreatedFood.statusCode).toBe(StatusCodes.INTERNAL_SERVER_ERROR)
    expect(JSON.parse(resCreatedFood.text).msg).toBe("Food validation failed: date: Please provide a date")
  })

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

});

afterAll(async () => {
  return tearDownDb();
});
