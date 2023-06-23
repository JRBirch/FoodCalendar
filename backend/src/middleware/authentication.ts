import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import CustomError from "../errors/custom_error";
import jwt, { JwtPayload } from "jsonwebtoken";

// Augment the original Request interface, so that it can contain
// a user via Declaration Merging.
declare module "express-serve-static-core" {
  export interface Request {
    user: {
      userId: string;
      name: string;
    };
  }
}

const authentication = async (req: Request, res: Response, next: NextFunction) => {
  const access_token = req.cookies.access_token;
  if (!access_token) {
    throw new CustomError("Authentication invalid", StatusCodes.UNAUTHORIZED);
  }
  try {
    const payload = jwt.verify(access_token, process.env.JWT_SECRET as string) as JwtPayload;
    req.user = { userId: payload.userId, name: payload.name };
    next();
  } catch (error) {
    throw new CustomError("Authentication invalid", StatusCodes.UNAUTHORIZED);
  }
};

export { authentication };
