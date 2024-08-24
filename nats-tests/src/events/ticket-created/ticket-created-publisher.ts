import { Publisher } from "../base/base-publisher";
import { Subjects } from "../base/subjects";
import { TicketCreatedEvent } from "./ticket-created-event.type";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  readonly subject: Subjects.TicketCreated = Subjects.TicketCreated;
}
