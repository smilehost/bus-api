import { account } from "@prisma/client";
import { AuthRepository } from "../repository/authRespository";
import { AppError } from "../utils/appError";
import { hashPassword } from "../utils/hashing";
import { signJwt } from "../utils/jwt";
import { Util } from "../utils/util";


export class AuthService {
    constructor (private readonly authRepository: AuthRepository) {}

    async login(username:string,password:string,lifeTime:number){
        const hashedPassword = await hashPassword(password)

        const user = await this.authRepository.login(username,hashedPassword)

        if (!user) {
            throw AppError.NotFound("Incorrect username or password")
        }

        if (user.account_status === 0){
            throw AppError.Forbidden("Your account is't in active")
        }

        const token = signJwt({ account_id:user.account_id,
                                account_role:user.account_role,
                                com_id:user.account_com_id,
         }
        ,lifeTime*3600);

        return token
    }    

    async register(com_id:number,account:account){
        const existingUser = await this.authRepository.getUserByUsername(account.account_username)
        if (existingUser) {
            throw AppError.Conflict("This username already existed")
        }

        account.account_com_id = com_id
        account.account_status = 1

        return await this.authRepository.register(account)
    }

    async changePassword(com_id:number,account_id:number,newPassword:string){
        const user = await this.authRepository.getUserById(account_id)
        if (!user) {
            throw AppError.NotFound("User not found")
        }

        if (!Util.ValidCompany(com_id, user.account_com_id)) {
            throw AppError.Forbidden("Company ID does not match");
        }

        return await this.authRepository.changePassword(user.account_id,newPassword) 
    }
}