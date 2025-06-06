import { account } from "@prisma/client";
import { JwtPayloadUser } from "../../../../cmd/dto";
import { AppError } from "../../../utils/appError";
import { Util } from "../../../utils/util";
import { AccountRepository } from "./accountRepository";
import { autoInjectable } from "tsyringe";

@autoInjectable()
export class AccountService {
  constructor(private readonly accountRepository: AccountRepository) {}

  async getByPagination(
    comId: number,
    accountRole:string,
    page: number,
    size: number,
    search: string,
    status: number
  ) {
    search = search.toString();

    const skip = (page - 1) * size;
    const take = size;

    const [data, total] = await this.accountRepository.getPaginated(
      comId,
      accountRole,
      skip,
      take,
      search,
      status
    );

    return {
      page,
      size,
      total,
      totalPages: Math.ceil(total / size),
      data,
    };
  }

  async getAll(comId: number): Promise<account[]> {
    return this.accountRepository.getAll(comId);
  }

  async getById(comId: number,requester:JwtPayloadUser, accountId: number) {
    const account = await this.accountRepository.getById(accountId);

    if (!account) throw AppError.NotFound("Account not found");
    Util.requesterPermissionCheck(requester,account,"lowerOrSelf")

    return account;
  }

  async update(comId: number,requester:JwtPayloadUser, accountId: number, data: account) {
    const existing = await this.accountRepository.getById(accountId);

    if (!existing) {
      throw AppError.NotFound("Account not found");
    }

    Util.requesterPermissionCheck(requester,existing,"lowerOrSelf")

    // เช็คเฉพาะ field ที่ถูกเปลี่ยน และอยู่ในรายการต้องห้าม
    const forbiddenFields: (keyof account)[] = [
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
      if (data.account_role === "1" || data.account_role === "2") {
        throw AppError.Forbidden("Account: Cannot change account role");
      }
    }

    const sanitized: Partial<account> = {
      account_name: data.account_name,
      account_role: data.account_role,
    };

    return this.accountRepository.update(accountId, sanitized);
  }

  async delete(comId: number, requester:JwtPayloadUser, account_id: number) {
    const account = await this.accountRepository.getById(account_id);
    
    if (!account) {
      throw AppError.NotFound("Account to delete not found");
    }
    Util.requesterPermissionCheck(requester,account,"lower")

    return this.accountRepository.delete(account_id);
  }
}
