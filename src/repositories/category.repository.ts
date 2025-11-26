import { Category, Prisma } from '../generated/prisma/client';
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

  async getByUserId(
    userId: number
  ): Promise<Category[]>;

  async getByUserId<T extends Prisma.CategoryInclude>(
    userId: number,
    include: T
  ): Promise<
    Prisma.CategoryGetPayload<{ include: T }>[]
  >;

  async getByUserId(
    userId: number,
    include?: Prisma.CategoryInclude
  ) {
    return this.prisma.category.findMany({
      where: { userId },
      ...(include && { include })
    });
  }



}
