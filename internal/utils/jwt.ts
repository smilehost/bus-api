import jwt, { SignOptions } from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || '';

export function signJwt(payload: object, exp:number) {
  return jwt.sign(payload, JWT_SECRET as jwt.Secret, { expiresIn:`${exp}h` });
}

export function verifyJwt(token: string) {
  return jwt.verify(token, JWT_SECRET as jwt.Secret);
}
