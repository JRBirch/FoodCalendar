import request from "supertest";
import { StatusCodes } from "http-status-codes";

import app from "../app";
import { connectDB, disconnectDB, dropDatabase } from "../db/connect";
import { User } from "../models/user";
import { error } from "console";

// Supertest handles setting up the server and tearing it down
const supertest = request(app);

beforeAll(async () => {
  return connectDB(`mongodb://localhost:27017/${process.env.TEST_DB}`);
});

describe("User Endpoints", () => {
  /**
   * Set up a user, for our tests
   */
  beforeAll(async () => {
    return initialiseUserDb();
  });

  test("Register User", async () => {
    const user = {
      name: "test2",
      email: "test2@test2.com",
      password: "test2password",
    };
    const res = await supertest.post("/api/v1/auth/register").send(user);
    expect(res.statusCode).toBe(StatusCodes.OK);
    expect(res.body).toStrictEqual({ user: { name: user.name } });
    const users = await User.find({});
    expect(users.length).toBe(2);
  });

  test("Errors On Register", async () => {
    const user = {
      name: "test2"
    } 
    const res = await supertest.post("/api/v1/auth/register").send(user);
    expect(res.statusCode).toBe(StatusCodes.INTERNAL_SERVER_ERROR)
    expect(JSON.parse(res.text).msg).toBe("User validation failed: password: Please provide password, email: Please provide email");
  });

  test("Login/Logout User", async () => {
    const user = {
      name: "test",
      email: "test@test.com",
      password: "testpassword",
    };
    const resLogin = await supertest.post("/api/v1/auth/login").send(user);
    expect(resLogin.statusCode).toBe(StatusCodes.OK);
    expect(resLogin.body).toStrictEqual({ user: { name: user.name } });
    const resLogout = await supertest.post("/api/v1/auth/logout");
    expect(resLogout.statusCode).toBe(StatusCodes.OK);
  });

  test("Errors On Login/Logout User", async () => {
    const userWrongPassword = {
      email: "test@test.com",
      password: "wrongpassword",
    };
    const resLoginWrongPassword = await supertest
      .post("/api/v1/auth/login")
      .send(userWrongPassword);
    expect(resLoginWrongPassword.statusCode).toBe(StatusCodes.UNAUTHORIZED);
    expect(JSON.parse(resLoginWrongPassword.text).msg).toBe("Invalid Credentials");

    const userWrongEmail = {
      email: "testw@testw.com",
      password: "testpassword",
    };
    const resLoginWrongEmail = await supertest.post("/api/v1/auth/login").send(userWrongEmail);
    expect(resLoginWrongEmail.statusCode).toBe(StatusCodes.UNAUTHORIZED);
    expect(JSON.parse(resLoginWrongEmail.text).msg).toBe("Invalid Credentials");

    const userWrongBody = {
      name: "test",
      password: "testpassword",
    };
    const resLoginWrongBody = await supertest.post("/api/v1/auth/login").send(userWrongBody);
    expect(resLoginWrongBody.statusCode).toBe(StatusCodes.BAD_REQUEST);
    expect(JSON.parse(resLoginWrongBody.text).msg).toBe("No password or email");
  });

  // Add tests for what happens when wrong input for both login and register
  // Both should throw exceptions
});

afterAll(async () => {
  await tearDownDb();
  return disconnectDB();
});

const initialiseUserDb = async () => {
  const user = {
    name: "test",
    email: "test@test.com",
    password: "testpassword",
  };
  await User.create(user);
};

/**
 * Tear down the entire db
 */
const tearDownDb = () => {
  return dropDatabase();
};
