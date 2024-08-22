import { NextFunction, Request, Response } from "express";
import { CustomError } from "../errors/custom-error";

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  //   console.error(err.stack);

  if (err instanceof CustomError) {
    return res.status(err.statusCode).send({
      type: err.type,
      errors: err.serializeErrors(),
    });
  }

  res.status(500).send({
    message: err.message,
  });
};
