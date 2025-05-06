import { PrismaClient } from "@prisma/client";
import { AppError } from "../utils/appError";
import { RouteLocation } from "../../cmd/models"; // หรือจะใช้ interface โดยตรงจากที่คุณเขียนก็ได้

export class AccountRepository {
  constructor(private readonly prisma: PrismaClient) {}

}
