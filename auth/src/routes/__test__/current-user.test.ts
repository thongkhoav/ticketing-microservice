import request from "supertest";
import app from "../../app";

it("responds with details about the current user", async () => {
  const authResponse = await request(app)
    .post("/api/users/signup")
    .send({
      email: "test@eaxample.com",
      password: "password",
    })
    .expect(201);

  const cookie = authResponse.get("Set-Cookie") || "";

  const response = await request(app)
    .get("/api/users/current-user")
    .set("Cookie", cookie[0])
    .send()
    .expect(200);

  expect(response.body.currentUser.email).toEqual("test@eaxample.com");
});

it("responds with null if not authenticated", async () => {
  const response = await request(app)
    .get("/api/users/current-user")
    .send()
    .expect(200);

  expect(response.body.currentUser).toEqual(null);
});
