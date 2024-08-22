import express from "express";
import { authRouter } from "./routes/authRouter";
import { errorHandler } from "./middlewares/error-handler";
import { NotFoundError } from "./errors/not-found-error";
import "express-async-errors";
import mongoose from "mongoose";
import cookieSession from "cookie-session";

const app = express();

app.set("trust proxy", true);
app.use(express.json());
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== "test",
  })
);

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.use("/api/users/", authRouter);

app.all("*", async (req, res) => {
  throw new NotFoundError();
});

app.use(errorHandler);

export default app;
