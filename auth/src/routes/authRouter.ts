import express, { Request, Response } from "express";
import { body } from "express-validator";
import { User } from "../models/user.model";
import {
  BadRequestError,
  validateRequest,
  currentUser,
} from "@finik-tickets/common";
import "express-async-errors";
import jwt from "jsonwebtoken";
import { Password } from "../services/password";

const router = express.Router();

router.get("/current-user", currentUser, (req, res) => {
  res.send({ currentUser: req.currentUser || null });
});

router.post(
  "/signin",
  [
    body("email").isEmail().withMessage("Email must be valid"),
    body("password")
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage("Password must be between 4 and 20 characters"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const existUser = await User.findOne({ email });
    if (!existUser) {
      throw new BadRequestError("Invalid Credentials");
    }

    const passwordMatch = await Password.compare(existUser.password, password);

    if (!passwordMatch) {
      throw new BadRequestError("Invalid Password");
    }

    const userJwt = jwt.sign(
      {
        id: existUser.id,
        email: existUser.email,
      },
      process.env.JWT_KEY!
    );

    req.session = { jwt: userJwt };

    res.status(200).send(existUser);
  }
);

router.post("/signout", (req, res) => {
  req.session = null;
  res.send({});
});

router.post(
  "/signup",

  [
    body("email").isEmail().withMessage("Email must be valid"),
    body("password")
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage("Password must be between 4 and 20 characters"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const existUser = await User.findOne({ email });
    if (existUser) {
      throw new BadRequestError("Email in use");
    }

    // const hashedPassword = await bcrypt.hash(password, 12);
    const user = User.build({ email, password });
    // user.password is plain text password

    await user.save();
    // user.password is hashed password

    const userJwt = jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      process.env.JWT_KEY!
    );

    req.session = { jwt: userJwt };

    res.status(201).send(user);
  }
);

export { router as authRouter };
