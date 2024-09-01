import {
  OrderCancelledEvent,
  OrderCreatedEvent,
  OrderStatus,
  Topics,
} from "@finik-tickets/common";
import { Admin, Consumer, EachMessagePayload, Producer } from "kafkajs";
import { Order } from "../../models/order.model";

export enum TopicConsume {
  OrderCancelled = Topics.OrderCancelled,
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
          const order = Order.build({
            id: data.id,
            price: data.ticket.price,
            status: data.status,
            userId: data.userId,
            version: data.version,
          });

          await order.save();

          break;
        }
        case TopicConsume.OrderCancelled: {
          const data: OrderCancelledEvent["data"] = parsedData;
          const order = await Order.findByEvent(data);

          if (!order) {
            throw new Error("Order not found");
          }

          order.set({ status: OrderStatus.Cancelled });
          await order.save();
          break;
        }
        default:
          console.log("Unknown topic:", topic);
      }
    },
  });
};
