import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { AccountRepository } from '../../internal/repository/accountRepository';
import { AccountService } from '../../internal/service/accountService';
import { AccountController } from '../../internal/controller/accountController';



export const Auth = (prisma: PrismaClient) => {
    const router = Router();

    const repo = new AccountRepository(prisma)
    const service = new AccountService(repo)
    const controller = new AccountController(service)

    router.get("/all", controller.getAll.bind(controller));


    return router
}

