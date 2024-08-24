import { Subjects, Publisher, OrderCreatedEvent } from "@finik-tickets/common";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  readonly subject: Subjects.OrderCreated = Subjects.OrderCreated; // subject is channel or topic
}
