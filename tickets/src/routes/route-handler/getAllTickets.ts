import { Request, Response } from "express";
import "express-async-errors";
import { Ticket } from "../../models/ticket.model";

export const getAllTickets = async (req: Request, res: Response) => {
  const tickets = await Ticket.find({});
  res.status(200).send(tickets);
};
