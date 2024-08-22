import { NextFunction, Request, Response } from "express";
import { CustomError } from "../errors/custom-error";
import { validationResult } from "express-validator";
import { RequestValidationError } from "../errors/request-validation-errors";

// validate before go to the route handler
export const validateRequest = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new RequestValidationError(errors.array());
  }
  next();
};
