import { AppError } from "../../../../shared/errors/AppError";
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { ICreateUserDTO } from "../../../users/useCases/createUser/ICreateUserDTO";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { ICreateStatementDTO } from "../createStatement/ICreateStatementDTO";
import { GetStatementOperationError } from "./GetStatementOperationError";
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase";

let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryStatementsRepository: InMemoryStatementsRepository;
let getStatementOperationUseCase: GetStatementOperationUseCase;

enum OperationType {
  DEPOSIT = "deposit",
  WITHDRAW = "withdraw",
}

describe("Get Statement Operation ", () => {
  inMemoryUsersRepository = new InMemoryUsersRepository();
  inMemoryStatementsRepository = new InMemoryStatementsRepository();
  getStatementOperationUseCase = new GetStatementOperationUseCase(
    inMemoryUsersRepository,
    inMemoryStatementsRepository
  );

  it("should be able to get a statement operation", async () => {
    const userToTest: ICreateUserDTO = {
      name: "it does not matter",
      email: "it does not matter",
      password: "it does not matter",
    };

    const { id: user_id = "" } = await inMemoryUsersRepository.create(
      userToTest
    );

    const statementToTest: ICreateStatementDTO = {
      amount: 100,
      description: "it does not matter",
      type: OperationType.DEPOSIT,
      user_id,
    };

    const { id: statement_id = "" } = await inMemoryStatementsRepository.create(
      statementToTest
    );

    const statement = await getStatementOperationUseCase.execute({
      user_id,
      statement_id,
    });

    expect(statement).toBeDefined();
    expect(statement).toHaveProperty("id");
    expect(statement).toHaveProperty("type");
    expect(statement).toHaveProperty("amount");
    expect(statement).toHaveProperty("user_id");
    expect(statement).toHaveProperty("description");
    expect(statement.id).toBe(statement_id);
    expect(statement.type).toBe(statementToTest.type);
    expect(statement.type).toBe(OperationType.DEPOSIT);
    expect(statement.amount).toBe(statementToTest.amount);
    expect(statement.user_id).toBe(statementToTest.user_id);
    expect(statement.user_id).toBe(user_id);
    expect(statement.description).toBe(statementToTest.description);
  });

  it("should be not able to get a statement operation when user not found", () => {
    expect(async () => {
      const idNotExists: string = "hi i not exists";

      const statementToTest: ICreateStatementDTO = {
        amount: 100,
        description: "it does not matter",
        type: OperationType.DEPOSIT,
        user_id: idNotExists,
      };

      const { id: statement_id = "" } =
        await inMemoryStatementsRepository.create(statementToTest);

      await getStatementOperationUseCase.execute({
        user_id: idNotExists,
        statement_id,
      });
    }).rejects.toBeInstanceOf(GetStatementOperationError.UserNotFound);
  });

  it("should be not able to get a statement operation when statement not found", () => {
    expect(async () => {
      const idNotExists: string = "hi i not exists";

      const userToTest: ICreateUserDTO = {
        name: "it does not matter",
        email: "it does not matter",
        password: "it does not matter",
      };

      const { id: user_id = "" } = await inMemoryUsersRepository.create(
        userToTest
      );

      await getStatementOperationUseCase.execute({
        user_id,
        statement_id: idNotExists,
      });
    }).rejects.toBeInstanceOf(GetStatementOperationError.StatementNotFound);
  });

  it("should be not able to get a statement operation when user and statement not found", () => {
    expect(async () => {
      const userIdNotExists: string = "hi i not exists";
      const statementIdNotExists: string = "hi i not exists";

      await getStatementOperationUseCase.execute({
        user_id: userIdNotExists,
        statement_id: statementIdNotExists,
      });
    }).rejects.toBeInstanceOf(AppError);
  });
});
