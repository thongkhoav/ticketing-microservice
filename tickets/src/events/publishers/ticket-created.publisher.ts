import { TicketCreatedEvent, Subjects, Publisher } from "@finik-tickets/common";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  readonly subject: Subjects.TicketCreated = Subjects.TicketCreated; // subject is channel or topic
}
