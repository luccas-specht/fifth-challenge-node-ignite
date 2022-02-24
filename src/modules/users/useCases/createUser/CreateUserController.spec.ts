import request from "supertest";
import { Connection } from "typeorm";
import { app } from "../../../../app";
import createConnection from "../../../../database";
import { ICreateUserDTO } from "./ICreateUserDTO";

let connection: Connection;

describe("CreateUserController", () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("should be able to create an user", async () => {
    const userToTest: ICreateUserDTO = {
      name: "it does not matter",
      email: "lukinhasppt@gmail.com",
      password: "it does not matter",
    };

    const response = await request(app).post("/api/v1/users").send(userToTest);

    expect(response.status).toBe(201);
  });
});

it("should be not able to create an user when email already exists", async () => {
  const user: ICreateUserDTO = {
    name: "it does not matter",
    email: "lukinhasppt@gmail.com",
    password: "it does not matter",
  };

  const response = await request(app).post("/api/v1/users").send(user);

  /* console.log(response); */

  expect(response.status).toBe(400);
});
