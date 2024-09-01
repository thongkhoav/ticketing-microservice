import { Queue, Worker } from "bullmq";
import { ExpirationCompleteProducer } from "../events/producers/expiration-complete-producer";
import { kafkaWrapper } from "../kafka-wrapper";

interface Payload {
  orderId: string;
}
const connection = {
  host: process.env.REDIS_URI,
  port: parseInt(process.env.REDIS_PORT || "6379"),
};

const expirationQueue = new Queue<Payload>("order:expiration", {
  connection,
});
expirationQueue.on("error", (err) => {
  console.error("Redis connection error:", err);
});

const expirationWoker = new Worker<Payload>(
  "order:expiration",
  async (job) => {
    // when order created,  add job delay 15p
    // after 15p, worker will publish event order complete
    console.log("Process job", job.data);
    await new ExpirationCompleteProducer(kafkaWrapper.producer).publish({
      orderId: job.data.orderId,
    });
  },
  {
    connection,
  }
);

export { expirationQueue, expirationWoker };
