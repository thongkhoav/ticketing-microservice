import { Request, Response } from "express";
import "express-async-errors";
import { Order } from "../../models/order.model";

export const getAllOrders = async (req: Request, res: Response) => {
  const orders = await Order.find({
    userId: req.currentUser!.id,
  }).populate("ticket");

  res.status(200).send(orders);
};
