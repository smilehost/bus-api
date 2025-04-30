import { Router } from 'express';
import { signJwt } from '../../internal/utils/jwt';
import { PrismaClient } from '@prisma/client';
import { AuthService } from '../../internal/service/authService';
import { AuthRepository } from '../../internal/repository/authRespository';
import { AuthController } from '../../internal/controller/authController';


export const Auth = (prisma: PrismaClient) => {
    const router = Router();

    const repo = new AuthRepository(prisma)
    const service = new AuthService(repo)
    const controller = new AuthController(service)

    router.post('/login',controller.login.bind(controller))
    router.post('/logout',controller.logout.bind(controller))
    router.post('/register',controller.register.bind(controller))
    router.post('/changepassword',controller.changePassword.bind(controller))
    router.post('/changeStatus',controller.changePassword.bind(controller))

    return router
}

