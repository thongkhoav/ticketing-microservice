import mongoose from "mongoose";
import app from "./app";

const startUp = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error("JWT_KEY must be defined");
  }
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI must be defined");
  }
  try {
    const PORT = 3000;

    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    app.listen(PORT, () => {
      console.log("Authh Server is running on port " + PORT);
    });
  } catch (error) {
    console.error(error);
  }
};
startUp();
