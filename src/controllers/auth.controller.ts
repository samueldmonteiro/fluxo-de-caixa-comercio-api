import { inject, injectable } from "tsyringe";
import { AuthService } from "../services/auth.service";
import { Request, Response } from "express";
import { UserRepository } from "../repositories/user.repository";
import { excludeParam } from "../config/functions";
import { User } from "../generated/prisma/client";
import { LoginDTO } from "../schemas/login.schema";

@injectable()
export class AuthController {

  constructor(
    @inject(AuthService) private service: AuthService,
    @inject(UserRepository) private repo: UserRepository
  ) { }

  login = async (req: Request, res: Response) => {
    const dto = req.body as LoginDTO;
    const auth = await this.service.login(dto);
    return res.json(auth);
  }

  me = async (req: Request, res: Response) => {
    const user = await this.repo.findById(req.user.sub);
    res.json(excludeParam(user as User, ['password']));
  }
}