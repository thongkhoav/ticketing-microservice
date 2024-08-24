import { OrderStatus } from "@finik-tickets/common";
import mongoose from "mongoose";
import { Order } from "./order.model";

// Attrs required to create a new Ticket.
export interface TicketAttrs {
  title: string;
  price: number;
}

// A TicketDoc interface that describes the properties that a Ticket Document has.
export interface TicketDoc extends mongoose.Document {
  title: string;
  price: number;
  isReserved(): Promise<boolean>;
}

//A custom static method build(attrs: TicketAttrs), which takes the attributes needed to create a Ticket and returns a TicketDoc.
interface TicketModel extends mongoose.Model<TicketDoc> {
  build(attrs: TicketAttrs): TicketDoc;
}

const ticketSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);

ticketSchema.statics.build = (attrs: TicketAttrs): TicketDoc => {
  return new Ticket(attrs);
};

ticketSchema.methods.isReserved = async () => {
  // this === the ticket document that we just called 'isReserved' on
  const existingOrder = await Order.findOne({
    ticket: this,
    status: {
      $in: [
        OrderStatus.Created,
        OrderStatus.AwaitingPayment,
        OrderStatus.Complete,
      ],
    },
  });

  return !!existingOrder;
};

const Ticket = mongoose.model<TicketDoc, TicketModel>("Ticket", ticketSchema);

export { Ticket };
