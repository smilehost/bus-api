// types/express/index.d.ts

//for can attach user login data to req in authMiddleware.ts
// types/express/index.d.ts

import { Request } from 'express';

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number;
        role: string;
      };
    }
  }
}

export {}; // very important to make this a module
