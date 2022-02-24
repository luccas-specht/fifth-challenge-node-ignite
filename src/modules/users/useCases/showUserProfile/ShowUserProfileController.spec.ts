import request from "supertest";
import { Connection } from "typeorm";

import { app } from "../../../../app";
import createConnection from "../../../../database";

let connection: Connection;

describe("Show User Profile Controller", () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  /* it("should be able to show user profile", async () => {
    const user = await request(app).post("/api/v1/users").send({
      name: "test",
      email: "teste@gail.com",
      password: "123teste",
    });

    console.log("user status", user.status);
    console.log("user body", user.body);

    const result = await request(app).post("/api/v1/sessions").send({
      email: "teste@gail.com",
      password: "123teste",
    });

    console.log("session status", result.status);
    console.log("session body", result.body);

    const response = await request(app)
      .get("/api/v1/profile")
      .set({ Authorization: `Bearer ${result.body.token}` });

    console.log('response',response.status);

     expect(response.status).toBe(201);
  }); */
});
