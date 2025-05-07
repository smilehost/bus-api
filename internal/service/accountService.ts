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

    if (!existing) {
      throw AppError.NotFound("Account not found");
    }

    if (!Util.ValidCompany(comId, existing.account_com_id)) {
      throw AppError.Forbidden("Account: Company ID does not match");
    }

    // เช็คเฉพาะ field ที่ถูกเปลี่ยน และอยู่ในรายการต้องห้าม
    const forbiddenFields: (keyof Account)[] = [
      "account_id",
      "account_username",
      "account_password",
      "account_com_id",
      "account_menu",
      "account_status",
    ];

    for (const key of forbiddenFields) {
      if (data[key] !== undefined && data[key] !== existing[key]) {
        throw AppError.Forbidden(
          `Account: Field "${key}" is not allowed to be updated`
        );
      }
    }

    if (data.account_role && data.account_role !== existing.account_role) {
      if (data.account_role === "1") {
        throw AppError.Forbidden("Account: Cannot change account role to '1'");
      }
    }

    const sanitized: Partial<Account> = {
      account_name: data.account_name,
      account_role: data.account_role,
    };

    return this.accountRepository.update(accountId, sanitized);
  }

  async delete(comId: number, account_id: number, accountId: number) {
    const accountToDelete = await this.accountRepository.getById(accountId);
    const requesterAccount = await this.accountRepository.getById(account_id);

    if (!accountToDelete) {
      throw AppError.NotFound("Account to delete not found");
    }

    if (!requesterAccount) {
      throw AppError.NotFound("Requester account not found");
    }

    if (!Util.ValidCompany(comId, accountToDelete.account_com_id)) {
      throw AppError.Forbidden("Account: Company ID does not match");
    }

    const requesterRole = parseInt(requesterAccount.account_role);
    const targetRole = parseInt(accountToDelete.account_role);

    if (isNaN(requesterRole) || isNaN(targetRole)) {
      throw AppError.BadRequest("Invalid account role format");
    }

    if (requesterRole > targetRole) {
      throw AppError.Forbidden(
        "You do not have permission to delete this account"
      );
    }

    return this.accountRepository.delete(accountId);
  }
}
