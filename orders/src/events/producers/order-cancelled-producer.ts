import {
  OrderCancelledEvent,
  BaseProducer,
  Topics,
} from "@finik-tickets/common";

export class OrderCancelledProducer extends BaseProducer<OrderCancelledEvent> {
  readonly topic: Topics.OrderCancelled = Topics.OrderCancelled; // subject is channel or topic
}
