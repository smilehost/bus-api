import { Request, Response, NextFunction } from 'express';
import { verifyJwt } from '../../internal/utils/jwt';

interface JwtPayload {
    account_id:number,
    account_role:string,
    com_id:number,
  }

export const authorizeRoles = (...allowedRoles: string[]) => {
return (req: Request, res: Response, next: NextFunction) =>{
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'No token provided' });
    }
    const token = authHeader.split(' ')[1];

    try {
        const decoded = verifyJwt(token) as JwtPayload;

        if (!allowedRoles.includes(decoded.account_role)) {
        return res.status(403).json({ message: 'Access denied: insufficient role' });
        }
    
        next();

    } catch (err) {
        return res.status(403).json({ message: 'Forbidden' });
    }
}
}
