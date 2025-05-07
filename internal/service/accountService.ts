import { AccountRepository } from "../repository/accountRepository";
import { Account } from "../../cmd/models";
import { AppError } from "../utils/appError";
import { Util } from "../utils/util";

export class AccountService {
  constructor(private readonly accountRepository: AccountRepository) {}

  async getAll(comId: number): Promise<Account[]> {
    return this.accountRepository.getAll(comId);
  }

  async getById(comId: number, accountId: number) {
    const account = await this.accountRepository.getById(accountId);

    if (!account) throw AppError.NotFound("Account not found");

    if (!Util.ValidCompany(comId, account.account_com_id)) {
      throw AppError.Forbidden("Account: Company ID does not match");
    }
    return account;
  }

  async update(comId: number, accountId: number, data: Account) {
    const existing = await this.accountRepository.getById(accountId);

    if (!existing) throw AppError.NotFound("Account not found");

    if (!Util.ValidCompany(comId, existing.account_com_id)) {
      throw AppError.Forbidden("Account: Company ID does not match");
    }

    const sanitized: Partial<Account> = {
      account_username: data.account_username,
      account_name: data.account_name,
      account_menu: data.account_menu,
      account_role: data.account_role,
    };

    return this.accountRepository.update(accountId, sanitized);
  }

  async delete(comId: number, accountId: number) {
    const account = await this.accountRepository.getById(accountId);

    if (!account) throw AppError.NotFound("Account not found");

    if (!Util.ValidCompany(comId, account.account_com_id)) {
      throw AppError.Forbidden("Account: Company ID does not match");
    }
    return this.accountRepository.delete(accountId);
  }
}
