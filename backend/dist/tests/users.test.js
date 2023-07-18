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
const user_1 = require("../models/user");
// Supertest handles setting up the server and tearing it down
const supertest = (0, supertest_1.default)(app_1.default);
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    return (0, connect_1.connectDB)(`mongodb://localhost:27017/${process.env.TEST_DB}`);
}));
describe("User Endpoints", () => {
    /**
     * Set up a user, for our tests
     */
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        return initialiseUserDb();
    }));
    test("Register User", () => __awaiter(void 0, void 0, void 0, function* () {
        const user = {
            name: "test2",
            email: "test2@test2.com",
            password: "test2password",
        };
        const res = yield supertest.post("/api/v1/auth/register").send(user);
        expect(res.statusCode).toBe(http_status_codes_1.StatusCodes.OK);
        expect(res.body).toStrictEqual({ user: { name: user.name } });
        const users = yield user_1.User.find({});
        expect(users.length).toBe(2);
    }));
    test("Errors On Register", () => __awaiter(void 0, void 0, void 0, function* () {
        const user = {
            name: "test2",
        };
        const res = yield supertest.post("/api/v1/auth/register").send(user);
        expect(res.statusCode).toBe(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
        expect(JSON.parse(res.text).msg).toBe("User validation failed: password: Please provide password, email: Please provide email");
    }));
    test("Login/Logout User", () => __awaiter(void 0, void 0, void 0, function* () {
        const user = {
            name: "test",
            email: "test@test.com",
            password: "testpassword",
        };
        const resLogin = yield supertest.post("/api/v1/auth/login").send(user);
        expect(resLogin.statusCode).toBe(http_status_codes_1.StatusCodes.OK);
        expect(resLogin.body).toStrictEqual({ user: { name: user.name } });
        const resLogout = yield supertest.post("/api/v1/auth/logout");
        expect(resLogout.statusCode).toBe(http_status_codes_1.StatusCodes.OK);
    }));
    test("Errors On Login/Logout User", () => __awaiter(void 0, void 0, void 0, function* () {
        const userWrongPassword = {
            email: "test@test.com",
            password: "wrongpassword",
        };
        const resLoginWrongPassword = yield supertest
            .post("/api/v1/auth/login")
            .send(userWrongPassword);
        expect(resLoginWrongPassword.statusCode).toBe(http_status_codes_1.StatusCodes.UNAUTHORIZED);
        expect(JSON.parse(resLoginWrongPassword.text).msg).toBe("Invalid Credentials");
        const userWrongEmail = {
            email: "testw@testw.com",
            password: "testpassword",
        };
        const resLoginWrongEmail = yield supertest.post("/api/v1/auth/login").send(userWrongEmail);
        expect(resLoginWrongEmail.statusCode).toBe(http_status_codes_1.StatusCodes.UNAUTHORIZED);
        expect(JSON.parse(resLoginWrongEmail.text).msg).toBe("Invalid Credentials");
        const userWrongBody = {
            name: "test",
            password: "testpassword",
        };
        const resLoginWrongBody = yield supertest.post("/api/v1/auth/login").send(userWrongBody);
        expect(resLoginWrongBody.statusCode).toBe(http_status_codes_1.StatusCodes.BAD_REQUEST);
        expect(JSON.parse(resLoginWrongBody.text).msg).toBe("No password or email");
    }));
});
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield tearDownDb();
    return (0, connect_1.disconnectDB)();
}));
const initialiseUserDb = () => __awaiter(void 0, void 0, void 0, function* () {
    const user = {
        name: "test",
        email: "test@test.com",
        password: "testpassword",
    };
    yield user_1.User.create(user);
});
/**
 * Tear down the entire db
 */
const tearDownDb = () => {
    return (0, connect_1.dropDatabase)();
};
