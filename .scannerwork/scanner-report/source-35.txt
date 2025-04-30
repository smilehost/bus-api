import { AuthRepository } from "../repository/authRespository";
import { AppError } from "../utils/appError";
import { hashPassword } from "../utils/hashing";
import { signJwt } from "../utils/jwt";

export class AuthService {
  constructor(private readonly authRepository: AuthRepository) {}

  async login(username: string, password: string) {
    const hashedPassword = await hashPassword(password);

    const user = await this.authRepository.login(username, hashedPassword);

    if (!user) {
      throw AppError.NotFound(
        "User not fond or incorrect username or password"
      );
    }

    const token = signJwt({
      account_id: user.account_id,

      com_id: user.account_com_id,
    });
  }
}
