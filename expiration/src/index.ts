import { consumerHandler } from "./events/consumers/consumer-handler";
import { kafkaWrapper } from "./kafka-wrapper";

const startUp = async () => {
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
  } catch (error) {
    console.error(error);
  }
};
startUp();
