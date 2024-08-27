import {
  OrderCreatedEvent,
  Listener,
  OrderStatus,
  Subjects,
} from "@finik-tickets/common";
import { Message } from "node-nats-streaming";
import { TICKET_QUEUE_GROUP } from "./ticketQueueGroup";
import { Ticket } from "../../models/ticket.model";
import { TicketUpdatedPublisher } from "../publishers/ticket-updated.publisher";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
  queueGroupName: string = TICKET_QUEUE_GROUP;
  async onMessage(
    data: OrderCreatedEvent["data"],
    msg: Message
  ): Promise<void> {
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
    await new TicketUpdatedPublisher(this.client).publish({
      id: ticket.id,
      price: ticket.price,
      title: ticket.title,
      userId: ticket.userId,
      orderId: ticket.orderId,
      version: ticket.version,
    });
    msg.ack();
  }
}
