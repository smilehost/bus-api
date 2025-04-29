import jwt, { SignOptions } from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || '';

export function signJwt(payload: object, expiresIn: SignOptions['expiresIn'] = '1h') {
  const options: SignOptions = { expiresIn };
  return jwt.sign(payload, JWT_SECRET as jwt.Secret, options);
}

export function verifyJwt(token: string) {
  return jwt.verify(token, JWT_SECRET as jwt.Secret);
}
