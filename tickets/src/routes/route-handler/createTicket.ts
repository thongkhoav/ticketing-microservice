import { Request, Response } from "express";
import "express-async-errors";
import { Ticket } from "../../models/ticket.model";

export const createTicket = async (req: Request, res: Response) => {
  const { title, price } = req.body;
  const ticket = Ticket.build({
    title,
    price,
    userId: req.currentUser!.id,
  });
  await ticket.save();
  res.status(201).send(ticket);
};
