import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { ICreateUserDTO } from "../createUser/ICreateUserDTO";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";
import { IncorrectEmailOrPasswordError } from "./IncorrectEmailOrPasswordError";

let inMemoryUsersRepository: InMemoryUsersRepository;
let authenticateUserUseCase: AuthenticateUserUseCase;

describe("Authenticated User Use Case", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    authenticateUserUseCase = new AuthenticateUserUseCase(
      inMemoryUsersRepository
    );
  });

  it("should be not able to authenticated an user when email is incorrect", () => {
    expect(async () => {
      const userToTest: ICreateUserDTO = {
        name: "Jon Snow",
        email: "JonathanSnow@gmail.com.br",
        password: "00980",
      };

      const userSessionToTest = {
        email: "daenerystargaryenoffical@gmail.com",
        password: userToTest.password,
      };

      await inMemoryUsersRepository.create(userToTest);
      await authenticateUserUseCase.execute(userSessionToTest);
    }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
  });

  it("should be not able to authenticated an user when email isn't exists", () => {
    expect(async () => {
      const userSessionToTest = {
        email: "JonathanSnow@gmail.com.br",
        password: "00980",
      };

      await authenticateUserUseCase.execute(userSessionToTest);
    }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
  });

  it("should be not able to authenticated an user when password is incorrect", () => {
    expect(async () => {
      const userToTest: ICreateUserDTO = {
        name: "Jaime Lannister",
        email: "lannister.jaime@gmail.com.br",
        password: "AUHSA&?/HG$11)",
      };

      const userSessionToTest = {
        email: userToTest.email,
        password: "password super secret",
      };

      await inMemoryUsersRepository.create(userToTest);
      await authenticateUserUseCase.execute(userSessionToTest);
    }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
  });
});
