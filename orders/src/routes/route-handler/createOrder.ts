import {
  BadRequestError,
  NotFoundError,
  OrderStatus,
} from "@finik-tickets/common";
import { Request, Response } from "express";
import "express-async-errors";
import { Ticket } from "../../models/ticket.model";
import { Order } from "../../models/order.model";
import { OrderCreatedProducer } from "../../events/producers/order-created-producer";
import { kafkaWrapper } from "../../../kafka-wrapper";

const EXPIRATION_WINDOW_SECONDS = 15 * 60;

export const createOrder = async (req: Request, res: Response) => {
  const { ticketId } = req.body;

  const ticket = await Ticket.findById(ticketId);
  if (!ticket) {
    throw new NotFoundError();
  }

  const isTicketReserved = await ticket.isReserved();

  if (isTicketReserved) {
    throw new BadRequestError("Ticket is already reserved");
  }

  const expiration = new Date();
  expiration.setSeconds(expiration.getSeconds() + EXPIRATION_WINDOW_SECONDS);

  const order = Order.build({
    userId: req.currentUser!.id,
    status: OrderStatus.Created,
    expiresAt: expiration,
    ticket,
  });

  await order.save();

  await new OrderCreatedProducer(kafkaWrapper.producer).publish({
    id: order.id,
    status: order.status,
    userId: order.userId,
    expiresAt: order.expiresAt.toISOString(),
    version: order.version,
    ticket: {
      id: ticket.id,
      price: ticket.price,
    },
  });

  res.status(201).send(order);
};
