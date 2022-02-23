import { compare } from "bcryptjs";
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { ICreateUserDTO } from "../createUser/ICreateUserDTO";
import { ShowUserProfileError } from "./ShowUserProfileError";
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase";

let usersRepository: InMemoryUsersRepository;
let showUserProfileUseCase: ShowUserProfileUseCase;

describe("Show User Profile Use Case", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    showUserProfileUseCase = new ShowUserProfileUseCase(usersRepository);
  });

  it("should be able to show an user profile", async () => {
    const userCreatedToTest: ICreateUserDTO = {
      name: "Bruno Fiap",
      email: "brunofiap@sap.com.br",
      password: "123456",
    };

    const { id = "" } = await usersRepository.create(userCreatedToTest);
    const result = await showUserProfileUseCase.execute(id);

    expect(result).toBeDefined();
    expect(result).toHaveProperty("id");
    expect(result).toHaveProperty("name");
    expect(result).toHaveProperty("email");
    expect(result).toHaveProperty("password");
    expect(result.id).toEqual(id);
    expect(result.name).toEqual(userCreatedToTest.name);
    expect(result.email).toEqual(userCreatedToTest.email);
    expect(async () => {
      await compare(userCreatedToTest.password, result.password);
    }).toBeTruthy();
  });

  it("should be not able to show an user profile that user non-exists", () => {
    expect(async () => {
      const userIdNonExists: string = "non-exists-id";

      await showUserProfileUseCase.execute(userIdNonExists);
    }).rejects.toBeInstanceOf(ShowUserProfileError);
  });
});
