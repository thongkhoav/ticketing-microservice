import express from "express";
import { ticketRouter } from "./routes/ticketRouter";
import {
  currentUser,
  errorHandler,
  NotFoundError,
} from "@finik-tickets/common";
import "express-async-errors";
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

app.use(currentUser);

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.use("/api/tickets", ticketRouter);

app.all("*", async (req, res) => {
  throw new NotFoundError();
});

app.use(errorHandler);

export default app;
