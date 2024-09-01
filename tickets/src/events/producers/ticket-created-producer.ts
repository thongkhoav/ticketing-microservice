import {
  BaseProducer,
  TicketCreatedEvent,
  Topics,
} from "@finik-tickets/common";

export class TicketCreatedProducer extends BaseProducer<TicketCreatedEvent> {
  readonly topic: Topics.TicketCreated = Topics.TicketCreated;
}
