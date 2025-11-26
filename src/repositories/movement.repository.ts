import { Movement, Prisma } from '../generated/prisma/client';
import { PaginatedResponse } from '../types/pagination';
import { Repository } from './repository';

export interface SimpleGetMovementsParams {
  userId: number;
  include?: Prisma.MovementInclude | null;
  search?: string;
  limit?: number;
  page?: number;
  startDate?: Date;
  endDate?: Date;
}

export class MovementRepository extends Repository<Movement> {
  constructor() {
    super('movement');
  }

  async getByUserId(params: SimpleGetMovementsParams): Promise<PaginatedResponse<Movement>> {
    const {
      userId,
      include,
      search,
      limit = 50,
      page = 1,
      startDate,
      endDate,
    } = params;

    const skip = (page - 1) * limit;

    const where: Prisma.MovementWhereInput = {
      userId,
    };

    if (startDate || endDate) {
      where.date = {
        ...(startDate ? { gte: startDate } : {}),
        ...(endDate ? { lte: endDate } : {})
      };
    }

    if (search && search.trim() !== '') {
      const numericSearch = parseFloat(search);
      const isNumeric = !isNaN(numericSearch) && isFinite(numericSearch);

      where.OR = [
        {
          description: {
            contains: search,
          }
        },
        {
          category: {
            is: {
              name: {
                contains: search,
              }
            }
          }
        },
        ...(isNumeric ? [{ value: { equals: numericSearch } }] : [])
      ];
    }

    const [data, total] = await Promise.all([
      this.prisma.movement.findMany({
        where,
        include: include ?? null,
        take: limit,
        skip,
        orderBy: { id: 'desc' }
      }),
      this.prisma.movement.count({ where })
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      }
    };
  }

  async findByIdAndUserId(id: string | number, userId: string | number): Promise<Movement | null> {
    return this.prisma.movement.findFirst({
      where: { id: Number(id), userId: Number(userId) }
    });
  }
}
