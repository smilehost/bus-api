import { PrismaClient } from "@prisma/client";
import { AppError } from "../utils/appError";


export class AuthRepository {
    constructor(private readonly prisma: PrismaClient) {}

    async login(username: string,password:string) {
        try {
          return await this.prisma.account.findFirst({
            where: {
                    account_username:username,
                    account_password:password,
            },
          });
    
        } catch (error) {
          throw AppError.fromPrismaError(error)
        }
      }
}