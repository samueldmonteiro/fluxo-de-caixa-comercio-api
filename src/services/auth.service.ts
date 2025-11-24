import { inject, injectable } from "tsyringe";
import bcrypt from 'bcryptjs'
import jwt from "jsonwebtoken";
import { UserRepository } from "../repositories/user.repository";
import { User } from "../generated/prisma/client";
import { AppError } from "../errors/app.error";
import { excludeParam } from "../config/functions";

interface LoginResponse {
  token: string
  user: Omit<User, 'password'>
}

@injectable()
export class AuthService {

  constructor(
    @inject(UserRepository)
    private userRepository: UserRepository
  ) { }

  async login(email: string, password: string): Promise<LoginResponse> {

    const user = await this.userRepository.findByEmail(email);

    if (!user) throw new AppError('Usuário não Encontrado!', 404);

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) throw new AppError('Senha Incorreta', 401);

    const token = jwt.sign(
      {
        sub: user.id,
        role: user.role
      },
      process.env.JWT_SECRET!,
      { expiresIn: '3d' }
    )

    return { user: excludeParam(user, ['password']), token }
  }

  verifyToken(token: string): any {
    return jwt.verify(token, process.env.JWT_SECRET!);
  }
}