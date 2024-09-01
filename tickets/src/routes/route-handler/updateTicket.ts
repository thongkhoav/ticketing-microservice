import { BadRequestError, UnAuthorizedError } from "@finik-tickets/common";
import { Request, Response } from "express";
import "express-async-errors";
import { Ticket } from "../../models/ticket.model";
import { TicketUpdatedProducer } from "../../events/producers/ticket-updated-producer";
import { kafkaWrapper } from "../../kafka-wrapper";

export const updateTicket = async (req: Request, res: Response) => {
  try {
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

    if (ticket.orderId) {
      throw new BadRequestError("Cannot edit a reserved ticket");
    }

    ticket.set({
      title,
      price,
    });
    await ticket.save();

    // publish ticket updated event
    await new TicketUpdatedProducer(kafkaWrapper.producer).publish({
      id: ticket.id,
      title: ticket.title,
      price: ticket.price,
      userId: ticket.userId,
      version: ticket.version,
    });
    res.status(200).send(ticket);
  } catch (error) {
    console.error(error);
    res.status(500).send("Something went wrong");
  }
};
