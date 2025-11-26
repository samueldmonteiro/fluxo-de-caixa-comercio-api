import { Request, Response } from "express";
import { inject, injectable } from "tsyringe";
import { UserRepository } from "../repositories/user.repository";
import { MovementRepository, SimpleGetMovementsParams } from "../repositories/movement.repository";
import { UserMapper } from "../mappers/user.mapper";
import { MovementMapper } from "../mappers/movement.mapper";
import { AppError } from "../errors/app.error";
import { UserService } from "../services/user.service";

@injectable()
export class UserController {
  constructor(
    @inject(UserRepository) private userRepo: UserRepository,
    @inject(MovementRepository) private movementRepo: MovementRepository,
    @inject(UserService) private service: UserService,

  ) { }

  getUsers = async (req: Request, res: Response) => {
    const users = await this.userRepo.findMany(undefined, { include: { movements: true } });
    return res.json(UserMapper.toMany(users));
  }

  movements = async (req: Request, res: Response) => {
    try {
      const { search, page, limit, startDate, endDate } = req.validated;

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

    const movements = await this.service.movementMetrics(Number(req.user.sub), {
      ...(startDate && { startDate: new Date(String(startDate)) }),
      ...(endDate && { endDate: new Date(String(endDate)) }),
    })

    return res.json(movements);
  }
}