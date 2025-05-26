// path: internal/controller/ticketController.ts
import { Request, Response } from "express";
import { TicketService } from "../service/ticketService";
import { AppError } from "../utils/appError";

export class TicketController {
  constructor(private readonly ticketService: TicketService) {}

}
