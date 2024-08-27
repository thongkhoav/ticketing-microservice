import { OrderStatus } from "@finik-tickets/common";
import mongoose from "mongoose";
import { Order } from "./order.model";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

// Attrs required to create a new Ticket.
export interface TicketAttrs {
  id: string;
  title: string;
  price: number;
}

// A TicketDoc interface that describes the properties that a Ticket Document has.
export interface TicketDoc extends mongoose.Document {
  title: string;
  price: number;
  version: number;
  isReserved(): Promise<boolean>;
}

//A custom static method build(attrs: TicketAttrs), which takes the attributes needed to create a Ticket and returns a TicketDoc.
interface TicketModel extends mongoose.Model<TicketDoc> {
  build(attrs: TicketAttrs): TicketDoc;
  findByEvent(event: {
    id: string;
    version: number;
  }): Promise<TicketDoc | null>;
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

ticketSchema.set("versionKey", "version");
ticketSchema.plugin(updateIfCurrentPlugin);

// ticketSchema.pre("save", function (done) {
//   console.log(this);
//   // @ts-ignore
//   this.$where = {
//     version: this.get("version") - 1,
//   };

//   done();
// });

ticketSchema.statics.build = (attrs: TicketAttrs): TicketDoc => {
  return new Ticket({
    _id: attrs.id,
    title: attrs.title,
    price: attrs.price,
  });
};

ticketSchema.statics.findByEvent = (event: { id: string; version: number }) => {
  return Ticket.findOne({
    _id: event.id,
    version: event.version - 1,
  });
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
