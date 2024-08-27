import {
  ExpirationCompleteEvent,
  Publisher,
  Subjects,
} from "@finik-tickets/common";

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  readonly subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
}
