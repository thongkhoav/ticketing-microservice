import request from "supertest";
import app from "../../app";

it("get all tickets", async () => {
  const response = await request(app).get("/api/tickets").send().expect(200);
});
