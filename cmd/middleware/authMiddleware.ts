import { Request, Response, NextFunction } from 'express';
import { verifyJwt } from '../../internal/utils/jwt';

interface JwtPayload {
    id: number;
    role: string;
  }

export const authorizeRoles = (...allowedRoles: string[]) => {
return (req: Request, res: Response, next: NextFunction) =>{
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401).json({ message: 'No token provided' });
        return 
    }
    const token = authHeader.split(' ')[1];

    try {
        const decoded = verifyJwt(token) as JwtPayload;

        if (!allowedRoles.includes(decoded.role)) {
        res.status(403).json({ message: 'Access denied: insufficient role' });
        return
        }
        //req.user = decoded;
        next();

    } catch (err) {
        res.status(403).json({ message: 'Forbidden' });
        return
    }
}
}
