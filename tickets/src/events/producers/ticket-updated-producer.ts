import {
  BaseProducer,
  TicketUpdatedEvent,
  Topics,
} from "@finik-tickets/common";

export class TicketUpdatedProducer extends BaseProducer<TicketUpdatedEvent> {
  topic: Topics.TicketUpdated = Topics.TicketUpdated;
}
