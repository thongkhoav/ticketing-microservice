import {
  BaseProducer,
  ExpirationCompleteEvent,
  Topics,
} from "@finik-tickets/common";

export class ExpirationCompleteProducer extends BaseProducer<ExpirationCompleteEvent> {
  readonly topic: Topics.ExpirationComplete = Topics.ExpirationComplete;
}
