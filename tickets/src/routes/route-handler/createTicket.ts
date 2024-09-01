import { Request, Response } from "express";
import "express-async-errors";
import { Ticket } from "../../models/ticket.model";
import { TicketCreatedProducer } from "../../events/producers/ticket-created-producer";
import { kafkaWrapper } from "../../kafka-wrapper";

export const createTicket = async (req: Request, res: Response) => {
  try {
    const { title, price } = req.body;
    const ticket = Ticket.build({
      title,
      price,
      userId: req.currentUser!.id,
    });
    await ticket.save();
    await new TicketCreatedProducer(kafkaWrapper.producer).publish({
      id: ticket.id,
      title: ticket.title,
      price: ticket.price,
      userId: ticket.userId,
      version: ticket.version,
    });
    res.status(201).send(ticket);
  } catch (error) {
    console.error(error);
    res.status(500).send("Something went wrong");
  }
};
