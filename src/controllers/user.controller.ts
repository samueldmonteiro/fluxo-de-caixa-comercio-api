import { Request, Response, response } from "express";
import { inject, injectable } from "tsyringe";
import { UserRepository } from "../repositories/user.repository";
import { excludeParam } from "../config/functions";
import { User } from "../generated/prisma/client";

@injectable()
export class UserController {

  constructor(
    @inject(UserRepository)
    private userRepo: UserRepository
  ) { }

  getUsers = async (req: Request, res: Response) => {
    const users = await this.userRepo.findById(2);
    return res.json(users);
  }
}