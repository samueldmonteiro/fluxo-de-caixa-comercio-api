import { MovementDomain, MovementMapper } from "./movement.mapper";

export interface UserDomain {
  id: string;
  name: string;
  email: string;
  displayName: string; 
  movements?: MovementDomain[] | undefined;
}

export class UserMapper {
  static toDomain(raw: any): UserDomain  {

    return {
      id: raw.id,
      name: raw.name,
      email: raw.email,
      displayName: `${raw.name} (${raw.email})`,

      ...(raw.movements && {
        movements: MovementMapper.toMany(raw.movements),
      }),
    };
  }

  static toMany(rawArray: any[]): UserDomain[] {
    return rawArray
      .map(UserMapper.toDomain)
      .filter(Boolean) as UserDomain[];
  }
}
