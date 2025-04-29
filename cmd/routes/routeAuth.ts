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

    router.post('/login')
    router.post('/logout')
    router.post('/register')
    router.post('/changepassword')


    return router
}

