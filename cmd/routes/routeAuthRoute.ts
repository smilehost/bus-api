import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthService } from '../../internal/service/authService';
import { AuthRepository } from '../../internal/repository/authRespository';
import { AuthController } from '../../internal/controller/authController';
import { authorizeRoles } from '../middleware/authMiddleware';

export class AuthRoutes {
    private router: Router;
    
    public repo: AuthRepository;
    public service: AuthService;
    public controller: AuthController;

    constructor(prisma: PrismaClient) {
        this.router = Router();
        
        this.repo = new AuthRepository(prisma);
        this.service = new AuthService(this.repo);
        this.controller = new AuthController(this.service);
        this.setupRoutes();
    }

    private setupRoutes(): void {
        this.router.post('/login', this.controller.login.bind(this.controller));
        this.router.post('/logout', this.controller.logout.bind(this.controller));
        this.router.post('/register', this.controller.register.bind(this.controller));
        this.router.post('/changepassword', authorizeRoles('1'), this.controller.changePassword.bind(this.controller));
        this.router.post('/changeStatus', authorizeRoles('1'), this.controller.changeStatus.bind(this.controller));
    }

    public routing(): Router {
        return this.router;
    }
}

// For backward compatibility
export const Auth = (prisma: PrismaClient) => {
    const authRoutes = new AuthRoutes(prisma);
    return authRoutes.routing();
}
