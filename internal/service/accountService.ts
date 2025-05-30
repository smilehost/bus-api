import { JwtPayloadUser } from "../../cmd/dto";
import { AccountRepository } from "../repository/accountRepository";
import { AppError } from "../utils/appError";
import { Util } from "../utils/util";
import { account } from "@prisma/client";

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
    this.requesterPermissionCheck(requester,account,true)

    return account;
  }

  async update(comId: number,requester:JwtPayloadUser, accountId: number, data: account) {
    const existing = await this.accountRepository.getById(accountId);

    if (!existing) {
      throw AppError.NotFound("Account not found");
    }

    this.requesterPermissionCheck(requester,existing,true)

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
    this.requesterPermissionCheck(requester,account,false)

    return this.accountRepository.delete(account_id);
  }

  private requesterPermissionCheck(requester:JwtPayloadUser,requested:account,allowedSame:boolean){
    if (!Util.ValidCompany(requester.com_id, requested.account_com_id) && 
        requester.account_role !== "1") {
      throw AppError.Forbidden("Account: Company ID does not match");
    }
    if(allowedSame){
      if (Number(requester.account_role)>Number(requested.account_role)) {
        throw AppError.Forbidden("Account: Your role is lower than The Requested");
      }
    }else{
      if (Number(requester.account_role)>=Number(requested.account_role)) {
        throw AppError.Forbidden("Account: Your role is lower or same level with The Requested");
      }
    }
  }
}
