import request from "supertest";
import app from "../../app";

it("only authenticated user can create ticket", async () => {
  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", global.signin())
    .send();

  expect(response.status).not.toEqual(401);
});

it("create ticket with invalid request", async () => {
  await request(app)
    .post("/api/tickets")
    .set("Cookie", global.signin())
    .send({})
    .expect(400);

  await request(app)
    .post("/api/tickets")
    .set("Cookie", global.signin())
    .send({
      price: 10,
    })
    .expect(400);
});
