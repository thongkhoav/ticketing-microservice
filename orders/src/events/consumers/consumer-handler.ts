import {
  ExpirationCompleteEvent,
  OrderCancelledEvent,
  OrderCreatedEvent,
  OrderStatus,
  PaymentCreatedEvent,
  TicketCreatedEvent,
  TicketUpdatedEvent,
  Topics,
} from "@finik-tickets/common";
import { Admin, Consumer, EachMessagePayload, Producer } from "kafkajs";
import { Ticket } from "../../models/ticket.model";
import { Order } from "../../models/order.model";
import { OrderCreatedProducer } from "../producers/order-created-producer";
import { kafkaWrapper } from "../../../kafka-wrapper";
import { OrderCancelledProducer } from "../producers/order-cancelled-producer";

export enum TopicConsume {
  ExpirationComplete = Topics.ExpirationComplete,
  PaymentCreated = Topics.PaymentCreated,
  TicketCreated = Topics.TicketCreated,
  TicketUpdated = Topics.TicketUpdated,
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
        case TopicConsume.ExpirationComplete: {
          const data: ExpirationCompleteEvent["data"] = parsedData;
          const order = await Order.findById(data.orderId).populate("ticket");

          if (!order) {
            throw new Error("order not found");
          }

          if (
            order.status === OrderStatus.Complete ||
            order.status === OrderStatus.Cancelled
          ) {
            return;
          }

          order?.set({
            status: OrderStatus.Cancelled,
          });
          await order?.save();

          const orderCreatedMessage: OrderCancelledEvent["data"] = {
            id: order.id,
            version: order.version,
            ticket: {
              id: order.ticket.id,
            },
          };
          new OrderCancelledProducer(kafkaWrapper.producer).publish(
            orderCreatedMessage
          );

          break;
        }
        case TopicConsume.PaymentCreated: {
          const data: PaymentCreatedEvent["data"] = parsedData;
          const order = await Order.findById(data.orderId);
          if (!order) {
            throw new Error("Order not found");
          }
          order.set({ status: OrderStatus.Complete });
          break;
        }
        case TopicConsume.TicketCreated: {
          const data: TicketCreatedEvent["data"] = parsedData;
          const ticket = Ticket.build({
            title: data.title,
            price: data.price,
            id: data.id,
          });
          await ticket.save();
          break;
        }
        case TopicConsume.TicketUpdated: {
          const data: TicketUpdatedEvent["data"] = parsedData;
          // check update event can be processed
          // find ticket with version less than incoming version
          const ticket = await Ticket.findByEvent(data);

          if (!ticket) {
            throw new Error("Ticket not found");
          }

          ticket?.set({
            title: data.title,
            price: data.price,
          });
          await ticket?.save();
          break;
        }
        default:
          console.log("Unknown topic:", topic);
      }
    },
  });
};
