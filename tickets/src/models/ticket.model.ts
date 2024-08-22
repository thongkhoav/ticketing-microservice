import mongoose from "mongoose";
import { version } from "os";

// Attrs required to create a new Ticket.
export interface TicketAttrs {
  title: string;
  price: number;
  userId: string;
}

// A TicketDoc interface that describes the properties that a Ticket Document has.
interface TicketDoc extends mongoose.Document {
  title: string;
  price: number;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

//A custom static method build(attrs: TicketAttrs), which takes the attributes needed to create a Ticket and returns a TicketDoc.
interface TicketModel extends mongoose.Model<TicketDoc> {
  build(attrs: TicketAttrs): TicketDoc;
}

const TicketSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    userId: {
      type: String,
      required: true,
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

TicketSchema.statics.build = (attrs: TicketAttrs): TicketDoc => {
  return new Ticket(attrs);
};

const Ticket = mongoose.model<TicketDoc, TicketModel>("Ticket", TicketSchema);

export { Ticket };
