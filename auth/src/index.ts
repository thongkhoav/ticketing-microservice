import mongoose from "mongoose";
import app from "./app";

const startUp = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error("JWT_KEY must be defined");
  }
  try {
    const MONGO_URI = "mongodb://auth-mongo-srv:27017/auth";
    const PORT = 3000;

    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB");

    app.listen(PORT, () => {
      console.log("Auth Server is running on port " + PORT);
    });
  } catch (error) {
    console.error(error);
  }
};
startUp();
