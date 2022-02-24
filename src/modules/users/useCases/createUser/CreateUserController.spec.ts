import request from "supertest";
import { Connection } from "typeorm";

import { app } from "../../../../app";
import CreateConnection from "../../../../database";

let connection: Connection;

describe("Authenticate User Controller", () => {
  beforeAll(async () => {
    connection = await CreateConnection();
    await connection.runMigrations();
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("should be able to create a user", async () => {
    const {
      body: { token },
    } = await request(app).post("/sessions").send({
      email: "fakeadmin@rentx.com.br",
      password: "fakeadmin",
    });

    const response = await request(app)
      .post("/categories")
      .send({
        name: "Fake category",
        description: "Fake description",
      })
      .set({ Authorization: `Bearer ${token}` });

    expect(response.status).toBe(201);
  });

  it("should not be able to create a new category with name exists", async () => {
    const {
      body: { token },
    } = await request(app).post("/sessions").send({
      email: "fakeadmin@rentx.com.br",
      password: "fakeadmin",
    });

    const response = await request(app)
      .post("/categories")
      .send({
        name: "Fake category",
        description: "Fake description",
      })
      .set({ Authorization: `Bearer ${token}` });

    expect(response.status).toBe(400);
  });
});
