import { Role, User } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';
import { Injectable } from '@nestjs/common';
import { TransactionOrClient } from '../shared/uow/unit-of-work';
import { BaseRepository } from '../shared/repository/base.repository';

@Injectable()
export class UsersRepository extends BaseRepository {
  constructor(protected readonly prisma: PrismaService) {
    super(prisma);
  }

  async findUserByName(
    name: string,
    tx?: TransactionOrClient,
  ): Promise<User | null> {
    const client = this.getClient(tx);
    return client.user.findUnique({
      where: { name },
    });
  }

  async createUser(
    name: string,
    password: string,
    tx?: TransactionOrClient,
  ): Promise<User> {
    const client = this.getClient(tx);
    return client.user.create({
      data: { name, password, role: Role.survivor },
    });
  }

  async findUserById(
    id: number,
    tx?: TransactionOrClient,
  ): Promise<User | null> {
    const client = this.getClient(tx);
    return client.user.findUnique({
      where: { id },
    });
  }
}
