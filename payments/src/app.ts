import express from "express";
import {
  currentUser,
  errorHandler,
  NotFoundError,
} from "@finik-tickets/common";
import "express-async-errors";
import cookieSession from "cookie-session";
import { paymentRouter } from "./routes/paymentRouter";
import { vnpayRouter } from "./routes/vnpayRouter";

const app = express();

app.set("trust proxy", true);
app.use(express.json());
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== "test",
  })
);

// add currentUser middleware to request object
// verify user based on jwt token in cookie
app.use(currentUser);

app.use("/api/payments", paymentRouter);
app.use("/api/vnpay", vnpayRouter);

app.all("*", async (req, res) => {
  throw new NotFoundError();
});

app.use(errorHandler);

export default app;
