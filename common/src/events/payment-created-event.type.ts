import { Topics } from "./topics";

export interface PaymentCreatedEvent {
  topic: Topics.PaymentCreated;
  data: {
    orderId: string;
  };
}
