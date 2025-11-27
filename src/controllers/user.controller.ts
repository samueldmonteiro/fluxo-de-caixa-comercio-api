import { Request, Response } from "express";
import { inject, injectable } from "tsyringe";
import { UserRepository } from "../repositories/user.repository";
import { MovementRepository, SimpleGetMovementsParams } from "../repositories/movement.repository";
import { UserMapper } from "../mappers/user.mapper";
import { MovementMapper } from "../mappers/movement.mapper";
import { AppError } from "../errors/app.error";
import { UserService } from "../services/user.service";
import { CategoryService } from "../services/category.service";
import { CategoryRepository } from "../repositories/category.repository";
import { Prisma } from "../generated/prisma/client";

@injectable()
export class UserController {
  constructor(
    @inject(UserRepository) private userRepo: UserRepository,
    @inject(MovementRepository) private movementRepo: MovementRepository,
    @inject(UserService) private userService: UserService,
    @inject(CategoryRepository) private categoryRepo: CategoryRepository,
  ) { }

  getUsers = async (req: Request, res: Response) => {
    const users = await this.userRepo.findMany(undefined, { include: { movements: true } });
    return res.json(UserMapper.toMany(users));
  }

  movements = async (req: Request, res: Response) => {
    try {
      const { search, page, limit, startDate, endDate } = req.query;

      const params: SimpleGetMovementsParams = {
        userId: req.user.sub,
        search: search as string,
        page: page ? parseInt(page as string) : 1,
        limit: limit ? parseInt(limit as string) : 50,
        ...(startDate && { startDate: new Date(String(startDate)) }),
        ...(endDate && { endDate: new Date(String(endDate)) }),
      };

      const response = await this.movementRepo.getByUserId(params);
      const movementsDomain = MovementMapper.toMany(response.data);

      return res.json({ data: movementsDomain, pagination: response.pagination });

    } catch (error) {
      console.error('Error in movements controller:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  movement = async (req: Request, res: Response) => {
    const movement = await this.movementRepo.findByIdAndUserId(Number(req.params.id), req.user.sub);
    if (!movement) {
      throw new AppError('Movimentação inexistente!', 404);
    }
    return res.json(MovementMapper.toDomain(movement));
  }

  movementMetrics = async (req: Request, res: Response) => {
    const { startDate, endDate } = req.validated;

    const movements = await this.userService.movementMetrics(Number(req.user.sub), {
      ...(startDate && { startDate: new Date(String(startDate)) }),
      ...(endDate && { endDate: new Date(String(endDate)) }),
    })

    return res.json(movements);
  }

  categories = async (req: Request, res: Response) => {
    const categories = await this.categoryRepo.getByUserId(req.user.sub);
    return res.json(categories);
  }

  category = async (req: Request, res: Response) => {
    const id = Number(req.params.id);

    const categorie = await this.categoryRepo.findByIdAndUserId(id, req.user.sub);
    if (!categorie) throw new AppError('Categoria Inexistente', 404);
    return res.json(categorie);
  }

  categoryMovements = async (req: Request, res: Response) => {
    const id = Number(req.params.id);

    const categorie = await this.categoryRepo.findByIdAndUserId(id, req.user.sub, { movements: true });
    if (!categorie) throw new AppError('Categoria Inexistente', 404);
    return res.json(categorie);
  }
}