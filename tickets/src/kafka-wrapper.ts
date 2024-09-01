import { Kafka, Producer, Consumer, Admin } from "kafkajs";

class KafkaWrapper {
  private _producer?: Producer;
  private _consumer?: Consumer;
  private _kafka?: Kafka;
  private _admin?: Admin;

  connect(clientId: string, brokers: string[]) {
    this._kafka = new Kafka({
      clientId,
      brokers,
    });

    this._producer = this._kafka.producer();
    this._consumer = this._kafka.consumer({ groupId: clientId });
    this._admin = this._kafka.admin();

    return new Promise<void>(async (resolve, reject) => {
      try {
        await this._producer?.connect();
        console.log("Connected to Kafka as Producer");

        await this._consumer?.connect();
        console.log("Connected to Kafka as Consumer");

        resolve();
      } catch (err) {
        reject(err);
      }
    });
  }

  get producer() {
    if (!this._producer) {
      throw new Error("Cannot access Kafka producer before connecting");
    }
    return this._producer;
  }

  get consumer() {
    if (!this._consumer) {
      throw new Error("Cannot access Kafka consumer before connecting");
    }
    return this._consumer;
  }

  get admin() {
    if (!this._admin) {
      throw new Error("Cannot access Kafka admin before connecting");
    }
    return this._admin;
  }
}

export const kafkaWrapper = new KafkaWrapper();
