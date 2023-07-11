import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

import CustomError from "../errors/custom_error";
import { User } from "../models/user";
import { Login, Register } from "./types";

type AuthResponse = {
  user: {
    name: string;
  };
};

/**
 * Register the user, which involves creating the user record, creating the JSON web token
 * then sending the name of the user and the token back to the client.
 */
const register = async (req: Request<undefined, undefined, Register>, res: Response<AuthResponse>) => {
  console.log("Registering User");
  const user = await User.create({ ...req.body });
  const token = user.createJWT();
  res
    .cookie("access_token", token, { httpOnly: true })
    .status(StatusCodes.OK)
    .json({ user: { name: user.name } });
};

/**
 * Log in the user, which involves finding the user record, check the password input and
 * the password on the system match, creating another JSON web token, and then sending the
 * user name and JSON web token back to the client.
 */
const login = async (
  req: Request<undefined, undefined, Login>,
  res: Response<AuthResponse>
) => {
  console.log("Logging User In");
  const { email, password } = req.body;
  if (!email || !password) {
    throw new CustomError("No password of email", StatusCodes.BAD_REQUEST);
  }
  const user = await User.findOne({ email });
  if (!user) {
    console.log("No user");
    throw new CustomError("Invalid Credentials", StatusCodes.UNAUTHORIZED);
  }
  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {
    console.log("Wrong password");
    throw new CustomError("Invalid Credentials", StatusCodes.UNAUTHORIZED);
  }
  const token = user.createJWT();
  res
    .status(StatusCodes.OK)
    .cookie("access_token", token, { httpOnly: true })
    .json({ user: { name: user.name } });
};

/**
 * Log out the user by removing the access_token cookie.
 */
const logout = async (req: Request<undefined, undefined, {}>, res: Response<undefined>) => {
  console.log("Logging User Out");
  res.clearCookie("access_token").sendStatus(StatusCodes.OK);
};

export { register, login, logout, type AuthResponse };
