import { account, PrismaClient } from "@prisma/client";
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

    async register(account:account) {
      try {
        return await this.prisma.account.create({
          data: {
            account_name:account.account_name,
            account_password:account.account_password,
            account_username:account.account_username,
            account_com_id:account.account_com_id,
            account_status:account.account_status,
            account_role:account.account_role,
            account_menu:account.account_menu
          },
        });
  
      } catch (error) {
        throw AppError.fromPrismaError(error)
      }
    }

    async getUserByUsername(username:string){
      try {
        return await this.prisma.account.findFirst({
          where:{account_username:username}
        })
      } catch (error) {
        throw AppError.fromPrismaError(error)
      }
    }

    async getUserById(account_id:number){
      try {
        return await this.prisma.account.findFirst({
          where:{account_id:account_id}
        })
      } catch (error) {
        throw AppError.fromPrismaError(error)
      }
    }

    async changePassword(account_id:number,newPassword:string){
      try {
        return await this.prisma.account.update({
          where:{account_id:account_id},
          data:{account_password:newPassword}
        })
      } catch (error) {
        throw AppError.fromPrismaError(error)
      }
    }
}