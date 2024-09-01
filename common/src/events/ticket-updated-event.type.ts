import { Topics } from "./topics";

export interface TicketUpdatedEvent {
  topic: Topics.TicketUpdated;
  data: {
    id: string;
    title: string;
    price: number;
    userId: string;
    version: number;
    orderId?: string;
  };
}
