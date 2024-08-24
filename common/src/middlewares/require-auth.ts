import { NextFunction, Request, Response } from "express";
import { UnAuthorizedError } from "../errors/unauthorized-error";

export const requireAuth = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // currentUser middleware set before this middleware

  if (!req.currentUser) {
    throw new UnAuthorizedError();
  }

  next();
};
