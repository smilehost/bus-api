import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthService } from '../../internal/service/authService';
import { AuthRepository } from '../../internal/repository/authRespository';
import { AuthController } from '../../internal/controller/authController';
import { authorizeRoles } from '../middleware/authMiddleware';



export const Auth = (prisma: PrismaClient) => {
    const router = Router();

    const repo = new AuthRepository(prisma)
    const service = new AuthService(repo)
    const controller = new AuthController(service)

    router.post('/login',controller.login.bind(controller))
    router.post('/logout',controller.logout.bind(controller))
    router.post('/register',controller.register.bind(controller))
    router.post('/changepassword',authorizeRoles('1'),controller.changePassword.bind(controller))
    router.post('/changeStatus',authorizeRoles('1'),controller.changeStatus.bind(controller))

    return router
}

