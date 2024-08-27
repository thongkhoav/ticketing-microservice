import { Listener, Subjects, TicketCreatedEvent } from "@finik-tickets/common";
import { Message } from "node-nats-streaming";
import { QUEUE_GROUP_NAME } from "./queue-group-name";
import { Ticket } from "../../models/ticket.model";

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
  subject: Subjects.TicketCreated = Subjects.TicketCreated;
  queueGroupName: string = QUEUE_GROUP_NAME;

  async onMessage(
    data: { id: string; title: string; price: number; userId: string },
    msg: Message
  ): Promise<void> {
    const ticket = await Ticket.build({
      title: data.title,
      price: data.price,
      id: data.id,
    });
    await ticket.save();
    msg.ack();
  }
}
