import { AccountRepository } from "../repository/accountRepository";
import { Account } from "../../cmd/models";

export class AccountService {
  constructor(private readonly accountRepository: AccountRepository) {}

  async getAll(comId: number): Promise<Account[]> {
    return this.accountRepository.getAll(comId);
  }
}