import { account } from "@prisma/client";
import { AuthRepository } from "../repository/authRespository";
import { AppError } from "../utils/appError";
import { hashPassword,comparePasswords } from "../utils/hashing";
import { signJwt } from "../utils/jwt";
import { Util } from "../utils/util";
import { RegisterAccount } from "../controller/authController";

export class AuthService {
  constructor(private readonly authRepository: AuthRepository) {}

    async login(username:string,password:string,lifeTime:number){
        const user = await this.authRepository.getUserByUsername(username)
        if (!user) {
            throw AppError.NotFound("Incorrect username or password")
        }

        const checkingHash = await comparePasswords(password,user.account_password)
        if (!checkingHash) {
            throw AppError.NotFound("Incorrect username or password")
        }

        if (user.account_status === 0){
            throw AppError.Forbidden("Your account is't in active")
        }
        const token = await signJwt({ account_id:user.account_id,
                                account_role:user.account_role,
                                com_id:user.account_com_id,
                                login_at: Date.now(),
         }
        ,lifeTime);
         console.log(token)
        return token
    }    

    async register(com_id:number,account:RegisterAccount){
        console.log("---------------3");
        const existingUser = await this.authRepository.getUserByUsername(account.username)
        if (existingUser) {
            throw AppError.Conflict("This username already existed")
        }
        console.log("---------------4");
        const hashedPassword = await hashPassword(account.password)

        const newAccount:account = {
            account_id:1,
            account_username:account.username,
            account_name:account.name,
            account_com_id:com_id,
            account_password:hashedPassword,
            account_status:1,
            account_role:account.role,
            account_menu:"",
        }

        return await this.authRepository.register(newAccount)
    }

    async changePassword(com_id:number,account_id:number,newPassword:string,changer:{account_id:number,account_role:string}){
        const user = await this.authRepository.getUserById(account_id)
        if (!user) {
            throw AppError.NotFound("User not found")
        }

        if (!Util.ValidCompany(com_id, user.account_com_id)) {
            throw AppError.Forbidden("Company ID does not match");
        }

        
        if (user.account_id !== changer.account_id && changer.account_role === "1"){
            throw AppError.Forbidden("can't change other admin password")
        }

        const hashedPassword = await hashPassword(newPassword)
        return await this.authRepository.changePassword(user.account_id,hashedPassword) 
    }

    async changeStatus(com_id:number,account_id:number,newStatus:number,changer:{account_id:number,account_role:string}){
        const user = await this.authRepository.getUserById(account_id)
        if (!user) {
            throw AppError.NotFound("User not found")
        }

        if (!Util.ValidCompany(com_id, user.account_com_id)) {
            throw AppError.Forbidden("Company ID does not match");
        }

        if (user.account_id !== changer.account_id && changer.account_role === "1"){
            throw AppError.Forbidden("can't change other admin status")
        }

        return await this.authRepository.changeStatus(user.account_id,newStatus) 
    }

    async createAdmin(com_id:number,name:string,username:string){
        const password = this.generatePassword()

        const newAdmin:RegisterAccount = {
            username:username,
            name:name,
            password:password,
            role:"1",
        }
        console.log("---------------2");
        const admin = await this.register(com_id,newAdmin)
        return {password,admin}
    }

    generatePassword(length: number = 10): string {
        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%&*_+~";
        let password = "";
      
        for (let i = 0; i < length; i++) {
          const randomIndex = Math.floor(Math.random() * chars.length);
          password += chars[randomIndex];
        }
      
        return password;
      }
      
}
