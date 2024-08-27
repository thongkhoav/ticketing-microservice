import { Listener, Subjects, OrderCancelledEvent } from "@finik-tickets/common";
import { Message } from "node-nats-streaming";
import { TICKET_QUEUE_GROUP } from "./ticketQueueGroup";
import { Ticket } from "../../models/ticket.model";

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
  queueGroupName: string = TICKET_QUEUE_GROUP;
  async onMessage(
    data: OrderCancelledEvent["data"],
    msg: Message
  ): Promise<void> {
    const ticket = await Ticket.findById(data.ticket.id);
    if (!ticket) {
      throw new Error("Ticket not found");
    }

    ticket.set({ orderId: undefined });
    await ticket.save();
    msg.ack();
  }
}
