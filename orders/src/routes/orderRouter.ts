import express from "express";

import { requireAuth, validateRequest } from "@finik-tickets/common";
import { body } from "express-validator";

const router = express.Router();

// router.get("/", getAllTickets);
// router.get("/:id", getOneTicket);

// added currentUser middleware to the route in app.ts
// requireAuth will check user based on currentUser middleware
router.post(
  "/",
  requireAuth,
  [
    body("title").not().isEmpty().withMessage("Title is required"),
    body("price")
      .isFloat({ gt: 0 })
      .withMessage("Price must be greater than 0"),
  ],
  validateRequest,
  (req, res) => {
    res.send("Created");
  }
);

router.put(
  "/:id",
  requireAuth,
  [
    body("title").not().isEmpty().withMessage("Title is required"),
    body("price")
      .isFloat({ gt: 0 })
      .withMessage("Price must be greater than 0"),
  ],
  validateRequest,
  (req, res) => {
    res.send("updated");
  }
);

export { router as orderRouter };
