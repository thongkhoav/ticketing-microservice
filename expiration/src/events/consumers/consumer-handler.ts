import { OrderCreatedEvent, Topics } from "@finik-tickets/common";
import { Admin, Consumer, EachMessagePayload, Producer } from "kafkajs";
import { expirationQueue } from "../../background-job/expiration-queue";

export enum TopicConsume {
  OrderCreated = Topics.OrderCreated,
}

export const consumerHandler = async (
  consumer: Consumer,
  kafkaAdmin: Admin,
  producer?: Producer
) => {
  if (!kafkaAdmin) {
    throw new Error("Kafka Admin is required");
  }
  if (!producer) {
    throw new Error("Kafka Producer is required");
  }
  if (!consumer) {
    throw new Error("Kafka Consumer is required");
  }
  await kafkaAdmin?.connect();
  await kafkaAdmin?.createTopics({
    topics: Object.values(TopicConsume).map((topic) => ({ topic })),
  });

  // Subscribe to multiple topics
  await consumer.subscribe({
    topics: Object.values(TopicConsume),
    fromBeginning: true,
  });

  // Process messages from the topics
  await consumer.run({
    eachMessage: async (payload: EachMessagePayload) => {
      const { topic, partition, message } = payload;
      const messageValue = message.value?.toString();
      console.log(
        `Received message from ${topic} [partition ${partition}]: ${messageValue}`
      );
      if (!messageValue) {
        console.log("Empty message received");
        return;
      }
      const parsedData = JSON.parse(messageValue);

      // You can handle each topic differently based on `topic` variable
      switch (topic) {
        case TopicConsume.OrderCreated: {
          const data: OrderCreatedEvent["data"] = parsedData;
          const delay =
            new Date(data.expiresAt).getTime() - new Date().getTime();
          await expirationQueue.add(
            "order:expiration",
            {
              orderId: data.id,
            },
            {
              delay,
            }
          );
          break;
        }

        default:
          console.log("Unknown topic:", topic);
      }
    },
  });
};
