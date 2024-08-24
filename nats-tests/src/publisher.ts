import nats from "node-nats-streaming";
import { Publisher } from "./events/base/base-publisher";
import { TicketCreatedPublisher } from "./events/ticket-created/ticket-created-publisher";
import { TicketCreatedEvent } from "./events/ticket-created/ticket-created-event.type";
console.clear();
const stan = nats.connect("ticketing", "abc", {
  url: "http://localhost:4222",
});

stan.on("connect", async () => {
  console.log("Publisher connected to NATS");

  const data: TicketCreatedEvent["data"] = {
    id: "123",
    title: "concert",
    price: 20,
  };
  const publisher = new TicketCreatedPublisher(stan);
  try {
    await publisher.publish(data);
  } catch (error) {
    console.log(error);
  }
});
