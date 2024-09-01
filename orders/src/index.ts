import mongoose from "mongoose";
import app from "./app";
import { kafkaWrapper } from "../kafka-wrapper";
import { consumerHandler } from "./events/consumers/consumer-handler";

const startUp = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error("JWT_KEY must be defined");
  }
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI must be defined");
  }
  // if (!process.env.NATS_CLUSTER_ID) {
  //   throw new Error("NATS_CLUSTER_ID must be defined");
  // }
  // if (!process.env.NATS_URL) {
  //   throw new Error("NATS_URL must be defined");
  // }
  // if (!process.env.NATS_CLIENT_ID) {
  //   throw new Error("NATS_CLIENT_ID must be defined");
  // }
  if (!process.env.KAFKA_URL) {
    throw new Error("KAFKA_URL must be defined");
  }

  if (!process.env.KAFKA_CLIENT_ID) {
    throw new Error("KAFKA_CLIENT_ID must be defined");
  }

  try {
    await kafkaWrapper.connect(process.env.KAFKA_CLIENT_ID, [
      process.env.KAFKA_URL,
    ]);

    await consumerHandler(
      kafkaWrapper.consumer,
      kafkaWrapper.admin,
      kafkaWrapper.producer
    );

    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    const PORT = 3000;
    app.listen(PORT, () => {
      console.log("Order Server is running on port " + PORT);
    });
  } catch (error) {
    console.error(error);
  }
};
startUp();
