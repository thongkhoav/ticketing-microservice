import {
  Listener,
  OrderCreatedEvent,
  OrderStatus,
  Subjects,
} from "@finik-tickets/common";
import { Message } from "node-nats-streaming";
import { PAYMENT_QUEUE_GROUP } from "./paymentQueueGroup";
import { Order } from "../../models/order.model";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
  queueGroupName: string = PAYMENT_QUEUE_GROUP;

  async onMessage(
    data: OrderCreatedEvent["data"],
    msg: Message
  ): Promise<void> {
    const order = Order.build({
      id: data.id,
      price: data.ticket.price,
      status: data.status,
      userId: data.userId,
      version: data.version,
    });

    await order.save();
    msg.ack();
  }
}
