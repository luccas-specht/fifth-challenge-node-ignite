import { AppError } from "../../../../shared/errors/AppError";
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { ICreateUserDTO } from "../createUser/ICreateUserDTO";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";

let usersRepository: InMemoryUsersRepository;
let authenticateUserUseCase: AuthenticateUserUseCase;

describe("Authenticated User Use Case", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    authenticateUserUseCase = new AuthenticateUserUseCase(usersRepository);
  });

  /* it("should be able to authenticated an user", async () => {
    const userTestToCreate: ICreateUserDTO = {
      name: "Lukinhas ppt",
      email: "lukinhasPpt157@gmail.com.br",
      password: "oi",
    };

    const { email, password } = await usersRepository.create(userTestToCreate);

    const result = await authenticateUserUseCase.execute({
      email,
      password,
    });

    expect(result.token).toBeDefined();
    expect(result.user).toBeDefined();
    expect(result.user).toHaveProperty("id");
    expect(result.user).toHaveProperty("name");
    expect(result.user).toHaveProperty("email");
    expect(result.user.email).toEqual(email);
  }); */

  it("should be not able to authenticated an user when email is incorrect", () => {
    expect(async () => {
      const userTestToCreate: ICreateUserDTO = {
        name: "Jon Snow",
        email: "JonathanSnow@gmail.com.br",
        password: "00980",
      };

      const userSession = {
        email: "daenerystargaryenoffical@gmail.com",
        password: userTestToCreate.password,
      };

      await usersRepository.create(userTestToCreate);
      await authenticateUserUseCase.execute(userSession);
    }).rejects.toBeInstanceOf(AppError);
  });

  it("should be not able to authenticated an user when email isn't exists", () => {
    expect(async () => {
      const userSession = {
        email: "JonathanSnow@gmail.com.br",
        password: "00980",
      };

      await authenticateUserUseCase.execute(userSession);
    }).rejects.toBeInstanceOf(AppError);
  });

  it("should be not able to authenticated an user when password is incorrect", () => {
    expect(async () => {
      const userTestToCreate: ICreateUserDTO = {
        name: "Jaime Lannister",
        email: "lannister.jaime@gmail.com.br",
        password: "AUHSA&?/HG$11)",
      };

      const userSession = {
        email: userTestToCreate.email,
        password: "password super secret",
      };

      await usersRepository.create(userTestToCreate);
      await authenticateUserUseCase.execute(userSession);
    }).rejects.toBeInstanceOf(AppError);
  });
});
