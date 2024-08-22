import request from "supertest";
import app from "../../app";

it("signin fail with an email that does not exist", async () => {
  await request(app)
    .post("/api/users/signin")
    .send({
      email: "test2@example.com",
      password: "password",
    })
    .expect(400);
});

it("signin fail with an incorrect password", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({
      email: "test@example.com",
      password: "password",
    })
    .expect(201);

  await request(app)
    .post("/api/users/signin")
    .send({
      email: "test@example.com",
      password: "324234324",
    })
    .expect(400);
});

it("signin responds with a cookie when given valid credentials", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({
      email: "test@example.com",
      password: "password",
    })
    .expect(201);

  const response = await request(app)
    .post("/api/users/signin")
    .send({
      email: "test@example.com",
      password: "password",
    })
    .expect(200);

  expect(response.get("Set-Cookie")).toBeDefined();
});
