import {
  OrderCancelledEvent,
  OrderCreatedEvent,
  TicketUpdatedEvent,
  Topics,
} from "@finik-tickets/common";
import { Admin, Consumer, EachMessagePayload, Kafka, Producer } from "kafkajs";
import { Ticket } from "../../models/ticket.model";
import { TicketUpdatedProducer } from "../producers/ticket-updated-producer";

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
          const ticket = await Ticket.findById(data.ticket.id);
          if (!ticket) {
            throw new Error("Ticket not found");
          }

          if (ticket.orderId) {
            throw new Error("Ticket already reserved");
          }

          ticket.set({ orderId: data.id });
          await ticket.save();

          // order service listen and update ticket collection in order service
          const ticketUpdateMessage: TicketUpdatedEvent["data"] = {
            id: ticket.id,
            price: ticket.price,
            title: ticket.title,
            userId: ticket.userId,
            orderId: ticket.orderId,
            version: ticket.version,
          };
          await new TicketUpdatedProducer(producer).publish(
            ticketUpdateMessage
          );

          break;
        }
        case TopicConsume.OrderCancelled: {
          const data: OrderCancelledEvent["data"] = parsedData;
          const ticket = await Ticket.findById(data.ticket.id);
          if (!ticket) {
            throw new Error("Ticket not found");
          }

          ticket.set({ orderId: undefined });
          await ticket.save();
          break;
        }
        default:
          console.log("Unknown topic:", topic);
      }
    },
  });
};
