import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { Prisma } from '@prisma/client';

export type TransactionOrClient = Prisma.TransactionClient | PrismaService;
export type TransactionClient = Prisma.TransactionClient;

@Injectable()
export class UnitOfWork {
  constructor(private readonly prisma: PrismaService) {}

  async execute<T>(work: (tx: TransactionClient) => Promise<T>): Promise<T> {
    return this.prisma.$transaction(async (tx) => work(tx));
  }
}
