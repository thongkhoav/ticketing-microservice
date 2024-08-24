import mongoose from "mongoose";

// Attrs required to create a new Order.
export interface OrderAttrs {
  title: string;
  price: number;
  userId: string;
}

// A OrderDoc interface that describes the properties that a Order Document has.
interface OrderDoc extends mongoose.Document {
  title: string;
  price: number;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

//A custom static method build(attrs: OrderAttrs), which takes the attributes needed to create a Order and returns a OrderDoc.
interface OrderModel extends mongoose.Model<OrderDoc> {
  build(attrs: OrderAttrs): OrderDoc;
}

const OrderSchema = new mongoose.Schema(
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

OrderSchema.statics.build = (attrs: OrderAttrs): OrderDoc => {
  return new Order(attrs);
};

const Order = mongoose.model<OrderDoc, OrderModel>("Order", OrderSchema);

export { Order };
