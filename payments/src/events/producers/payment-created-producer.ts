import {
  BaseProducer,
  PaymentCreatedEvent,
  Topics,
} from "@finik-tickets/common";

export class PaymentCreatedProducer extends BaseProducer<PaymentCreatedEvent> {
  topic: Topics.PaymentCreated = Topics.PaymentCreated;
}
