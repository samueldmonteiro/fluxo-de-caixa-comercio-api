import { inject, injectable } from "tsyringe";
import { MovementRepository } from "../repositories/movement.repository";
import { StoreMovementDTO } from "../schemas/movement/storeMovement.schema";
import { Category, Movement } from "../generated/prisma/client";
import { AppError } from "../errors/app.error";
import { CategoryRepository } from "../repositories/category.repository";
import { Decimal } from "../generated/prisma/internal/prismaNamespace";
import { UpdateMovementDTO } from "../schemas/movement/updateMovement.schema";
import { MovementDomain, MovementMapper } from "../mappers/movement.mapper";

@injectable()
export class MovementService {
  constructor(
    @inject(MovementRepository) private movementRepo: MovementRepository,
    @inject(CategoryRepository) private categoryRepo: CategoryRepository
  ) { }

  async store(dto: StoreMovementDTO, userId: number): Promise<MovementDomain> {

    if (!dto.categoryId && !dto.categoryName) {
      throw new AppError('É necessário informar o categoryId ou categoryName', 401);
    }

    let category: null | Category = null;

    if (!dto.categoryId && dto.categoryName) {

      const searchCategoryName = await this.categoryRepo.findByName(dto.categoryName);
      if (searchCategoryName) {
        category = searchCategoryName;
      } else {
        category = await this.categoryRepo.create<Omit<Category, 'id'>>({ name: dto.categoryName ?? '' });
      }
    }

    if (dto.categoryId) {
      category = await this.categoryRepo.findById(dto.categoryId);
      if (!category) {
        throw new AppError('Categoria Inexistente', 404);
      }
    }

    dto.categoryId = category?.id || dto.categoryId;

    const movement = await this.movementRepo.create<Omit<Movement, 'id'>>({
      userId,
      value: Decimal(dto.value),
      description: dto.description ?? null,
      categoryId: dto.categoryId ?? null,
      type: dto.type,
      date: (new Date())
    });

    return MovementMapper.toDomain(movement);
  }

  async update(dto: UpdateMovementDTO, userId: number, movementId: number): Promise<MovementDomain> {
    const movement = await this.movementRepo.findById(movementId);
    if (!movement) throw new AppError('Movimentação Inexistente', 404);

    if (movement.userId != userId) {
      throw new AppError('Movimentação não pertence à esta conta, autorização negada!', 403);
    }

    let category: null | Category = null;

    if (!dto.categoryId && dto.categoryName) {
      const searchCategoryName = await this.categoryRepo.findByName(dto.categoryName);

      if (searchCategoryName) {
        category = searchCategoryName;
      } else {
        category = await this.categoryRepo.create<Omit<Category, 'id'>>({ name: dto.categoryName ?? '' });
      }
    }

    if (!dto.categoryName && dto.categoryId) {
      category = await this.categoryRepo.findById(dto.categoryId);
      if (!category) {
        throw new AppError('Categoria Inexistente', 404);
      }
    }

    dto.categoryId = category?.id || dto.categoryId;

    const movementUpdated = await this.movementRepo.update(movementId, {
      value: Decimal(dto.value ?? movement.value),
      description: dto.description ?? movement.description,
      categoryId: dto.categoryId ?? movement.categoryId,
      type: dto.type ?? movement.type,
      date: dto.date ?? movement.date
    });

    return MovementMapper.toDomain(movementUpdated);
  }

  async delete(userId: number, movementId: number): Promise<void> {
    const movement = await this.movementRepo.findById(movementId);
    if (!movement) throw new AppError('Movimentação Inexistente', 404);

    if (movement?.userId != userId) {
      throw new AppError('Movimentação não pertence à esta conta, autorização negada!', 403);
    }

    this.movementRepo.delete(movementId);
  }
}