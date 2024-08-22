import { BadRequestError, UnAuthorizedError } from "@finik-tickets/common";
import { Request, Response } from "express";
import "express-async-errors";
import { Ticket } from "../../models/ticket.model";

export const updateTicket = async (req: Request, res: Response) => {
  const { title, price } = req.body;
  if (!req.params.id) {
    throw new BadRequestError("Ticket ID is required");
  }

  const ticket = await Ticket.findById(req.params.id);
  if (!ticket) {
    throw new BadRequestError("Ticket not found");
  }

  if (ticket.userId !== req.currentUser!.id) {
    throw new UnAuthorizedError();
  }

  ticket.set({
    title,
    price,
  });
  await ticket.save();
  res.status(200).send(ticket);
};
