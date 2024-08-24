import {
  BadRequestError,
  NotFoundError,
  UnAuthorizedError,
} from "@finik-tickets/common";
import { Request, Response } from "express";
import "express-async-errors";
import { Order } from "../../models/order.model";

export const getOrderById = async (req: Request, res: Response) => {
  const order = await Order.findById(req.params.id).populate("ticket");
  if (!order) {
    throw new NotFoundError();
  }

  if (order.userId !== req.currentUser!.id) {
    throw new UnAuthorizedError();
  }

  res.status(200).send(order);
};
