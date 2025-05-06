import { RouteLocation } from "../../cmd/models";
import { AppError } from "../utils/appError";
import { Util } from "../utils/util";
import { AccountRepository } from "../repository/accountRepository";

export class AccountService {
  constructor(
    private readonly accountRepository: AccountRepository
  ) {}
}
