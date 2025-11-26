import { Category } from '../generated/prisma/client';
import { Repository } from './repository';

export class CategoryRepository extends Repository<Category> {
  constructor() {
    super('category');
  }

  async findByName(name: string): Promise<Category | null> {
    return this.prisma.category.findFirst({
      where: { name }
    })
  }
}
