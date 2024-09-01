import { Topics } from "./topics";
import { OrderStatus } from "./types/order-status";

export interface OrderCreatedEvent {
  topic: Topics.OrderCreated;
  data: {
    id: string;
    status: OrderStatus;
    userId: string;
    expiresAt: string;
    version: number;
    ticket: {
      id: string;
      price: number;
    };
  };
}
