import { Prisma, PrismaClient } from '../generated/prisma/client';
import prisma from '../config/prisma'

export abstract class Repository<T> {
  protected prisma: PrismaClient
  constructor(
    private readonly model: string
  ) {
    this.prisma = prisma;
  }

  async create<B>(data: B): Promise<T> {
    return (this.prisma[this.model as any] as any).create({ data });
  }

  async findById(id: string | number): Promise<T | null> {
    return (this.prisma[this.model as any] as any).findUnique({
      where: { id }
    });
  }

  async findOne(where: any): Promise<T | null> {
    return (this.prisma[this.model as any] as any).findFirst({ where });
  }

  async findMany(where?: any, options?: any): Promise<T[]> {
    return (this.prisma[this.model as any] as any).findMany({
      where,
      ...options
    });
  }

  async update<B>(id: string | number, data: B): Promise<T> {
    return (this.prisma[this.model as any] as any).update({
      where: { id },
      data
    });
  }

  async delete(id: string | number): Promise<T> {
    return (this.prisma[this.model as any] as any).delete({
      where: { id }
    });
  }

  async count(where?: any): Promise<number> {
    return (this.prisma[this.model as any] as any).count({ where });
  }

  async findByIdAndUserId<T extends object = any>(
    id: string | number,
    userId: string | number,
    include?: T
  ): Promise<(T extends object ? any : any) | null> {
    return (this.prisma[this.model as any] as any).findFirst({
      where: { id: Number(id), userId: Number(userId) },
      ...(include ? { include } : {})
    });
  }

}