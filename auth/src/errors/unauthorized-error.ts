import { CustomError } from "./custom-error";

export class UnAuthorizedError extends CustomError {
  type = "Unauthorized";
  statusCode = 401;

  constructor() {
    super("Unauthorized");

    Object.setPrototypeOf(this, UnAuthorizedError.prototype);
  }

  serializeErrors() {
    return [{ message: this.message }];
  }
}
