import { User } from '../generated/prisma/client';
import { Repository } from './repository';

export class UserRepository extends Repository<User> {
  constructor() {
    super('user');
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { email }
    });
  }
}
