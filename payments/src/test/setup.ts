import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
let mongo: any;

declare global {
  var signin: () => string[];
}

jest.mock("../nats-wrapper");

beforeAll(async () => {
  process.env.JWT_KEY = "testkey";
  mongo = await MongoMemoryServer.create();
  const mongoUri = mongo.getUri();
  await mongoose.connect(mongoUri, {});
});

beforeEach(async () => {
  const collections = await mongoose?.connection?.db?.collections();
  if (collections) {
    for (let collection of collections) {
      await collection.deleteMany({});
    }
  }
});

afterAll(async () => {
  if (mongo) {
    await mongo.stop();
  }
  await mongoose.connection.close();
});

global.signin = () => {
  // build jwt payload { id, email }
  const payload = {
    id: new mongoose.Types.ObjectId().toHexString(),
    email: "test@example.com",
  };
  const token = jwt.sign(payload, process.env.JWT_KEY!);
  // build session object { jwt: JWT_PAYLOAD }
  const session = { jwt: token };
  // turn that session into JSON
  const sessionJSON = JSON.stringify(session);
  // encode JSON as base64
  const base64 = Buffer.from(sessionJSON).toString("base64");
  // return a string thats the cookie with the encoded data
  return [`session=${base64}`];
};
