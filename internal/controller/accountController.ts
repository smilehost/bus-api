import { Request, Response } from "express";
import { ExceptionHandler } from "../utils/exception";
import { Util } from "../utils/util";
import { AppError } from "../utils/appError";
import { RouteLocation } from "../../cmd/models";
import { AccountService } from "../service/accountService";

export class AccountController {
  constructor(private readonly accountService: AccountService) {}

}
