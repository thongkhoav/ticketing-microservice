import {
  Subjects,
  Publisher,
  OrderCancelledEvent,
} from "@finik-tickets/common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  readonly subject: Subjects.OrderCancelled = Subjects.OrderCancelled; // subject is channel or topic
}
