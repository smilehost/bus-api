import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthService } from '../../internal/service/authService';
import { AuthRepository } from '../../internal/repository/authRespository';
import { AuthController } from '../../internal/controller/authController';


export const Auth = (prisma: PrismaClient) => {
    const router = Router();

    const repo = new AuthRepository(prisma)
    const service = new AuthService(repo)
    const controller = new AuthController(service)

    router.post('/login',controller.login)
    // router.post('/refresh',controller.refresh)
    router.post('/logout',controller.logout)
    router.post('/register',controller.register)
    // router.post('/changepassword',controller.changePassword)


    return router
}

