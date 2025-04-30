import jwt, { SignOptions } from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || '24dea3a84ba0d579ce811254b1ed7e24c64acc6730fc1eb1d179647e4b872c03';

export function signJwt(payload: object, expiresIn: SignOptions['expiresIn'] = '1h') {
  const options: SignOptions = { expiresIn };
  return jwt.sign(payload, JWT_SECRET as jwt.Secret, options);
}

export function verifyJwt(token: string) {
  return jwt.verify(token, JWT_SECRET as jwt.Secret);
}
