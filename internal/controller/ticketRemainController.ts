import { Request, Response } from "express";
import { RouteTicketService } from "../service/routeTicketService";
import { ExceptionHandler } from "../utils/exception";
import { Util } from "../utils/util";
import { AppError } from "../utils/appError";
import { RouteTicketWithPrices } from "../../cmd/request";
import { RouteTicketPriceType } from "../../cmd/models";
import { RouteService } from "../service/routeService";
import { TicketRemainService } from "../service/ticketRemainService";

export class TicketRemainController {
  constructor(private readonly ticketRemainService: TicketRemainService) {}
}
