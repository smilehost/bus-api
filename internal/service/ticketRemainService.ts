import { AccountRepository } from "../repository/accountRepository";
import { Account } from "../../cmd/models";
import { AppError } from "../utils/appError";
import { Util } from "../utils/util";
import { TicketRemainRepository } from "../repository/ticketRemainRepository";

export class TicketRemainService {
  constructor(private readonly ticketRemainRepository: TicketRemainRepository) {}

}
