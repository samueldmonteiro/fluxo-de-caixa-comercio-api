import { Request, Response } from "express";
import { inject, injectable } from "tsyringe";
import { CategoryService } from "../services/category.service";
import { StoreCategoryDTO } from "../schemas/category/storeCategory.schema";
import { UpdateCategoryDTO } from "../schemas/category/updateCategory.schema";

@injectable()
export class CategoryController {

  constructor(
    @inject(CategoryService) private categoryService: CategoryService,
  ) { }

  store = async (req: Request, res: Response) => {

    const dto = req.validated as StoreCategoryDTO;
    const response = await this.categoryService.store(dto, req.user.sub);
    return res.json(response);
  }

  update = async (req: Request, res: Response) => {

    const dto = req.validated as UpdateCategoryDTO;
    const id = Number(req.params.id);
    const response = await this.categoryService.update(dto, id, req.user.sub);
    return res.json(response);
  }

  delete = async (req: Request, res: Response) => {

    const id = Number(req.params.id);
    await this.categoryService.delete(id, req.user.sub);
    return res.json({ message: "Categoria deletada com sucesso" });
  }
}