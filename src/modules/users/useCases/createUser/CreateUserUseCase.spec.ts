import { compare } from "bcryptjs";

import { AppError } from "../../../../shared/errors/AppError";
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";

import { CreateUserUseCase } from "./CreateUserUseCase";
import { ICreateUserDTO } from "./ICreateUserDTO";

let usersRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;

describe("Create User Use Case", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(usersRepository);
  });

  it("should be able to create an user", async () => {
    const userTestToCreate: ICreateUserDTO = {
      name: "Lukinhas ppt",
      email: "lukinhaspp562@gmail.com",
      password: "password super secret",
    };

    const result = await createUserUseCase.execute(userTestToCreate);

    expect(result).toBeDefined();
    expect(result).toHaveProperty("id");
    expect(result).toHaveProperty("name");
    expect(result).toHaveProperty("email");
    expect(result).toHaveProperty("password");
    expect(result.email).toEqual(userTestToCreate.email);
    expect(result.name).toEqual(userTestToCreate.name);
    expect(async () => {
      await compare(userTestToCreate.password, result.password);
    }).toBeTruthy();
  });

  it("should be not able to create an user when email already exists", () => {
    expect(async () => {
      const firstUseCreate: ICreateUserDTO = {
        name: "sandro arruda",
        email: "sandrinhus123@gmail.com",
        password: "password free",
      };

      const secondUserCreate: ICreateUserDTO = {
        name: "jeniffer lopes",
        email: firstUseCreate.email,
        password: "1726712&%",
      };

      await createUserUseCase.execute(firstUseCreate);
      await createUserUseCase.execute(secondUserCreate);
    }).rejects.toBeInstanceOf(AppError);
  });
});
