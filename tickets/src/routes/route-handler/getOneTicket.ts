import { BadRequestError } from "@finik-tickets/common";
import { Request, Response } from "express";
import "express-async-errors";
import { Ticket } from "../../models/ticket.model";

export const getOneTicket = async (req: Request, res: Response) => {
  const ticketId = req.params.id;
  if (!ticketId) {
    throw new BadRequestError("Ticket ID is required");
  }
  const ticket = await Ticket.findById(ticketId);
  if (!ticket) {
    throw new BadRequestError("Ticket not found");
  }
  res.status(200).send(ticket);
};
