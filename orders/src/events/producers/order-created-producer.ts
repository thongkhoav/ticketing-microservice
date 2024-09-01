import { OrderCreatedEvent, BaseProducer, Topics } from "@finik-tickets/common";

export class OrderCreatedProducer extends BaseProducer<OrderCreatedEvent> {
  readonly topic: Topics.OrderCreated = Topics.OrderCreated; // subject is channel or topic
}
