import { AppError } from "../../../../shared/errors/AppError";
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { ICreateUserDTO } from "../../../users/useCases/createUser/ICreateUserDTO";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementUseCase } from "./CreateStatementUseCase";
import { ICreateStatementDTO } from "./ICreateStatementDTO";

let inMemoryStatementsRepository: InMemoryStatementsRepository;
let inMemoryUsersRepository: InMemoryUsersRepository;
let createStatementUseCase: CreateStatementUseCase;

enum OperationType {
  DEPOSIT = "deposit",
  WITHDRAW = "withdraw",
}

describe("Create Statement UseCase", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    createStatementUseCase = new CreateStatementUseCase(
      inMemoryUsersRepository,
      inMemoryStatementsRepository
    );
  });

  it("should be able to create a statement when type is deposit", async () => {
    const userCreatedToTest: ICreateUserDTO = {
      name: "it doesn't matter",
      email: "it doesn't matter",
      password: "it doesn't matter",
    };

    const { id: user_id = "" } = await inMemoryUsersRepository.create(
      userCreatedToTest
    );

    const statementCreatedToTest: ICreateStatementDTO = {
      user_id,
      amount: 100,
      description: "it doesn't matter",
      type: OperationType.DEPOSIT,
    };

    const result = await createStatementUseCase.execute(statementCreatedToTest);

    expect(result).toBeDefined();
    expect(result).toHaveProperty("id");
    expect(result).toHaveProperty("type");
    expect(result).toHaveProperty("amount");
    expect(result).toHaveProperty("user_id");
    expect(result).toHaveProperty("description");
    expect(result.type).toBe(OperationType.DEPOSIT);
    expect(result.amount).toBe(statementCreatedToTest.amount);
    expect(result.user_id).toBe(user_id);
    expect(result.description).toBe(statementCreatedToTest.description);
  });

  it("should be able to create a statement when type is withdraw", async () => {
    const userCreatedToTest: ICreateUserDTO = {
      name: "whatever name",
      email: "whatever email",
      password: "whatever password",
    };

    const { id: user_id = "" } = await inMemoryUsersRepository.create(
      userCreatedToTest
    );

    const statementCreatedToTest: ICreateStatementDTO = {
      user_id,
      amount: 0,
      description: "it doesn't matter",
      type: OperationType.WITHDRAW,
    };

    const result = await createStatementUseCase.execute(statementCreatedToTest);

    expect(result).toBeDefined();
    expect(result).toHaveProperty("id");
    expect(result).toHaveProperty("type");
    expect(result).toHaveProperty("amount");
    expect(result).toHaveProperty("user_id");
    expect(result).toHaveProperty("description");
    expect(result.type).toBe(OperationType.WITHDRAW);
    expect(result.amount).toBe(statementCreatedToTest.amount);
    expect(result.user_id).toBe(user_id);
    expect(result.description).toBe(statementCreatedToTest.description);
  });

  it("should be not able to create a statement when type is deposit and user doesn't exists", () => {
    expect(async () => {
      const user_id: string = "it's a fake id";

      const statementCreatedToTest: ICreateStatementDTO = {
        user_id,
        amount: 0,
        description: "it doesn't matter",
        type: OperationType.DEPOSIT,
      };

      await createStatementUseCase.execute(statementCreatedToTest);
    }).rejects.toBeInstanceOf(AppError);
  });

  it("should be not able to create a statement when type withdraw and user doesn't exists", () => {
    expect(async () => {
      const user_id: string = "it's a fake id";

      const statementCreatedToTest: ICreateStatementDTO = {
        user_id,
        amount: 0,
        description: "it doesn't matter",
        type: OperationType.WITHDRAW,
      };

      await createStatementUseCase.execute(statementCreatedToTest);
    }).rejects.toBeInstanceOf(AppError);
  });

  it("should be not able to create a statement when type is withdraw and user has insufficient funds", () => {
    expect(async () => {
      const userCreatedToTest: ICreateUserDTO = {
        name: "Thiago Nigro(relax man, i'm only kidding with you)",
        email: "whatever email",
        password: "whatever password",
      };

      const { id: user_id = "" } = await inMemoryUsersRepository.create(
        userCreatedToTest
      );

      const statementCreatedToTest: ICreateStatementDTO = {
        user_id,
        amount: 1e20,
        description: "it doesn't matter",
        type: OperationType.WITHDRAW,
      };

      await createStatementUseCase.execute(statementCreatedToTest);
    }).rejects.toBeInstanceOf(AppError);
  });
});
