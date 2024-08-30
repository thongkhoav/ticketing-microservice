import {
  BadRequestError,
  NotFoundError,
  OrderStatus,
  requireAuth,
  UnAuthorizedError,
  validateRequest,
} from "@finik-tickets/common";
import express, { Request, Response } from "express";
import { body } from "express-validator";
import { Order } from "../models/order.model";
import axios from "axios";

const router = express.Router();

router.get("/", (req: Request, res: Response) => {
  res.send({ success: true });
});

router.post(
  "/",
  requireAuth,
  [body("orderId").not().isEmpty()],
  validateRequest,
  async (req: Request, res: Response) => {
    const { token, orderId } = req.body;
    console.log("payment 1");

    const order = await Order.findById(orderId);
    console.log("payment 2");

    await axios
      .get("http://payments-srv:3000/api/vnpay")
      .then((response) => {
        console.log(response.data);
      })
      .catch((err) => {
        console.log(err);
      });

    if (!order) {
      throw new NotFoundError();
    }

    if (order.userId !== req.currentUser!.id) {
      throw new UnAuthorizedError();
    }

    if (order.status === OrderStatus.Cancelled) {
      throw new BadRequestError("Cannot pay for a cancelled order");
    }

    res.send({ success: true });
  }
);

export { router as paymentRouter };
