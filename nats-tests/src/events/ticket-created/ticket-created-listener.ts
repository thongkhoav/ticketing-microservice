import { Message } from "node-nats-streaming";
import { Listener } from "../base/base-listener";
import { Subjects } from "../base/subjects";
import { TicketCreatedEvent } from "./ticket-created-event.type";

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
  readonly subject: Subjects.TicketCreated = Subjects.TicketCreated;
  queueGroupName: string = "payments-service";
  onMessage(data: TicketCreatedEvent["data"], msg: Message): void {
    console.log("Event data!", data);
    msg.ack();
  }
}
