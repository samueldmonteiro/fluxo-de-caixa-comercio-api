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

type MovementResult<TInclude extends Prisma.MovementInclude | null> =
  TInclude extends null
  ? Movement
  : Prisma.MovementGetPayload<{ include: TInclude }>;


export class MovementRepository extends Repository<Movement> {
  constructor() {
    super('movement');
  }

  async getByUserId<
    TInclude extends Prisma.MovementInclude | null = null
  >(
    params: SimpleGetMovementsParams & { include?: TInclude }
  ): Promise<PaginatedResponse<MovementResult<TInclude>>> {

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
        { description: { contains: search } },
        { category: { is: { name: { contains: search } } } },
        ...(isNumeric ? [{ value: { equals: numericSearch } }] : []),
      ];
    }

    const paginationEnabled = limit !== 0;

    const [data, total] = await Promise.all([
      this.prisma.movement.findMany({
        where,
        ...(include ? { include } : {}), // <-- só envia quando existe
        ...(paginationEnabled ? { take: limit, skip } : {}),
        orderBy: { id: 'desc' }
      }),
      this.prisma.movement.count({ where })
    ]);


    const totalPages = paginationEnabled ? Math.ceil(total / limit) : 1;

    return {
      data: data as MovementResult<TInclude>[], // <-- o cast agora é seguro
      pagination: {
        page: paginationEnabled ? page : 1,
        limit,
        total,
        totalPages,
        hasNext: paginationEnabled ? page < totalPages : false,
        hasPrev: paginationEnabled ? page > 1 : false,
      }
    };
  }
}