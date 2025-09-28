import { Prisma } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';
import { TransactionOrClient } from '../uow/unit-of-work';

export abstract class BaseRepository {
  protected constructor(protected readonly prisma: PrismaService) {}

  protected getClient(
    tx?: TransactionOrClient,
  ): Prisma.TransactionClient | PrismaService {
    return (tx as Prisma.TransactionClient) ?? this.prisma;
  }
}
