import { Express } from 'express';
import * as multer from 'multer';

declare global {
  namespace Express {
    interface Request {
      file?: multer.File;
      files?: {
        [fieldname: string]: multer.File[];
      } | multer.File[];
    }
  }
}
