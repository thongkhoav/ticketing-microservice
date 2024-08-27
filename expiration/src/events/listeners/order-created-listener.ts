import {
  Listener,
  OrderCreatedEvent,
  OrderStatus,
  Subjects,
} from "@finik-tickets/common";
import { Message } from "node-nats-streaming";
import { EXPIRATION_QUEUE_GROUP } from "./expirationQueueGroup";
import { expirationQueue } from "../../background-job/expiration-queue";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
  queueGroupName: string = EXPIRATION_QUEUE_GROUP;

  async onMessage(
    data: OrderCreatedEvent["data"],
    msg: Message
  ): Promise<void> {
    // calculate delay in milliseconds
    const delay = new Date(data.expiresAt).getTime() - new Date().getTime();
    await expirationQueue.add(
      "order:expiration",
      {
        orderId: data.id,
      },
      {
        delay,
      }
    );
    msg.ack();
  }
}
