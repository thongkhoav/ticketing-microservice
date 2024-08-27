import { Listener, Subjects, TicketUpdatedEvent } from "@finik-tickets/common";
import { Message } from "node-nats-streaming";
import { QUEUE_GROUP_NAME } from "./queue-group-name";
import { Ticket } from "../../models/ticket.model";

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
  subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
  queueGroupName: string = QUEUE_GROUP_NAME;

  async onMessage(
    data: TicketUpdatedEvent["data"],
    msg: Message
  ): Promise<void> {
    // check update event can be processed
    // find ticket with version less than incoming version
    const ticket = await Ticket.findByEvent(data);
    console.log("ticket", ticket);

    if (!ticket) {
      throw new Error("Ticket not found");
    }

    // if (ticket.userId !== req.currentUser!.id) {
    //   throw new UnAuthorizedError();
    // }

    ticket?.set({
      title: data.title,
      price: data.price,
    });
    await ticket?.save();
    msg.ack();
  }
}
