import { Request, Response } from "express";
import "express-async-errors";
import { Order } from "../../models/order.model";
import {
  NotFoundError,
  OrderStatus,
  UnAuthorizedError,
} from "@finik-tickets/common";
import { OrderCancelledProducer } from "../../events/producers/order-cancelled-producer";
import { kafkaWrapper } from "../../../kafka-wrapper";

export const cancelOrder = async (req: Request, res: Response) => {
  const order = await Order.findOne({
    id: req.params.id,
    status: {
      $in: [OrderStatus.Created, OrderStatus.AwaitingPayment],
    },
  }).populate("ticket");

  if (!order) {
    throw new NotFoundError();
  }

  if (order.userId !== req.currentUser!.id) {
    throw new UnAuthorizedError();
  }

  order.status = OrderStatus.Cancelled;
  await order.save();

  await new OrderCancelledProducer(kafkaWrapper.producer).publish({
    id: order.id,
    version: order.version,
    ticket: {
      id: order.ticket.id,
    },
  });

  res.status(204).send(order);
};
