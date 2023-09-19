import { Request, Response, NextFunction } from "express";
import CustomError from "../errors/custom_error";
import { StatusCodes } from "http-status-codes";
/**
 * Error handler middleware which will raise a Custom Error
 */
const errorHandlerMiddleware = (error: Error, req: Request, res: Response, next: NextFunction) => {
  if (error instanceof CustomError) {
    return res.status(error.statusCode).json({ msg: error.message });
  }
  return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({msg: error.message});
};

export default errorHandlerMiddleware;
