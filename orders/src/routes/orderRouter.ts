import express, { Request, Response } from "express";

import { requireAuth, validateRequest } from "@finik-tickets/common";
import { body } from "express-validator";
import { getOrderById } from "./route-handler/getOrderById";
import { getAllOrders } from "./route-handler/getAllOrders";
import { createOrder } from "./route-handler/createOrder";
import { cancelOrder } from "./route-handler/cancelOrder";
import mongoose from "mongoose";

const router = express.Router();

router.get("/", requireAuth, getAllOrders);
router.get("/:id", requireAuth, getOrderById);

// added currentUser middleware to the route in app.ts
// requireAuth will check user based on currentUser middleware
router.post(
  "/",
  requireAuth,
  [
    body("ticketId")
      .not()
      .isEmpty()
      .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
      .withMessage("Ticket ID is required"),
  ],
  validateRequest,
  createOrder
);

router.delete("/:id", requireAuth, cancelOrder);

export { router as orderRouter };
