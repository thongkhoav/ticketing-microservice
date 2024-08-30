import {
  PaymentCreatedEvent,
  Publisher,
  Subjects,
} from "@finik-tickets/common";

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
}
