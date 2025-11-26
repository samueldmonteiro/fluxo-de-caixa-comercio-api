import { inject, injectable } from "tsyringe";
import { CategoryRepository } from "../repositories/category.repository";
import { StoreCategoryDTO } from "../schemas/category/storeCategory.schema";
import { Category } from "../generated/prisma/client";
import { AppError } from "../errors/app.error";
import { UpdateCategoryDTO } from "../schemas/category/updateCategory.schema";

@injectable()
export class CategoryService {

  constructor(
    @inject(CategoryRepository) private categoryRepo: CategoryRepository
  ) { }

  async store(dto: StoreCategoryDTO, userId: number): Promise<Category> {

    const category = await this.categoryRepo.create<Omit<Category, 'id'>>({
      ...dto,
      userId
    });

    return category;
  }

  async update(dto: UpdateCategoryDTO, categoryId: number, userId: number): Promise<Category> {

    const category = await this.categoryRepo.findByIdAndUserId(categoryId, userId);
    if (!category) throw new AppError('Categoria Inexistente', 404);

    dto.name = dto.name ?? category.name;

    const categoryUpdated = await this.categoryRepo.update<UpdateCategoryDTO>(categoryId, dto);

    return categoryUpdated;
  }

  async delete(categoryId: number, userId: number): Promise<void> {

    const category = await this.categoryRepo.findByIdAndUserId(categoryId, userId);
    if (!category) throw new AppError('Categoria Inexistente', 404);

    this.categoryRepo.delete(categoryId);
  }
}