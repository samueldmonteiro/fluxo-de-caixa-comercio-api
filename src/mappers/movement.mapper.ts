import { UserDomain, UserMapper } from "./user.mapper";

export interface MovementDomain {
  id: string;
  value: number;
  type: string;
  date: Date;
  categoryId: string;
  userId: string;
  description: string | null;
  user?: UserDomain | null | undefined;
}

export class MovementMapper {
  
  static toDomain(raw: any): MovementDomain {
  
    return {
      id: raw.id,
      value: raw.value,
      type: raw.type,
      date: raw.date,
      categoryId: raw.categoryId,
      userId: raw.userId,
      description: raw.description,

      user: raw.user ? UserMapper.toDomain(raw.user) : undefined,
    };
  }

  static toMany(rawArray: any[]): MovementDomain[] {
    return rawArray.map(MovementMapper.toDomain).filter(Boolean) as MovementDomain[];
  }
}