import { AppError } from "../../../../shared/errors/AppError";
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { GetBalanceUseCase } from "./GetBalanceUseCase";

let inMemoryStatementsRepository: InMemoryStatementsRepository;
let inMemoryUsersRepository: InMemoryUsersRepository;
let getBalanceUseCase: GetBalanceUseCase;

describe("Get Balance UseCase", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    getBalanceUseCase = new GetBalanceUseCase(
      inMemoryStatementsRepository,
      inMemoryUsersRepository
    );
  });

  it("should return the balance of the user", async () => {
    const userToTest = {
      name: "it does not matter",
      email: "it does not matter",
      password: "it does not matter",
    };

    const { id: user_id = "" } = await inMemoryUsersRepository.create(
      userToTest
    );
    const result = await getBalanceUseCase.execute({ user_id });

    expect(result).toBeDefined();
    expect(result).toHaveProperty("balance");
    expect(result).toHaveProperty("statement");
    expect(result.balance).toBe(0);
    expect(result.statement).toHaveLength(0);
  });

  it("should not return the balance of the user when user does not exists", () => {
    expect(async () => {
      const fakeId: string = "fakeId";
      await getBalanceUseCase.execute({ user_id: fakeId });
    }).rejects.toBeInstanceOf(AppError);
  });
});
