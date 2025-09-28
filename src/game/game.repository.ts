import { PrismaService } from 'nestjs-prisma';
import { Injectable } from '@nestjs/common';
import { Round, RoundPlayer, Status } from '@prisma/client';
import { TransactionOrClient } from '../shared/uow/unit-of-work';
import { BaseRepository } from '../shared/repository/base.repository';
import { CreateRoundDto } from './dto/create-round.dto';

@Injectable()
export class GameRepository extends BaseRepository {
  constructor(protected readonly prisma: PrismaService) {
    super(prisma);
  }

  async findRoundById(
    id: number,
    tx?: TransactionOrClient,
  ): Promise<Round | null> {
    const client = this.getClient(tx);
    return client.round.findUnique({
      where: {
        id,
      },
    });
  }

  async joinRound(
    id: number,
    userId: number,
    tx?: TransactionOrClient,
  ): Promise<Round> {
    const client = this.getClient(tx);
    return await client.round.update({
      where: {
        id,
      },
      data: {
        roundPlayers: {
          connectOrCreate: {
            where: {
              userId_roundId: {
                userId,
                roundId: id,
              },
            },
            create: { userId },
          },
        },
      },
      include: { roundPlayers: { include: { user: true } } },
    });
  }

  async incrementUserTap(
    userId: number,
    roundId: number,
    tx?: TransactionOrClient,
  ): Promise<{ taps: number }> {
    const client = this.getClient(tx);
    const afterTap = await client.roundPlayer.update({
      where: {
        userId_roundId: {
          userId,
          roundId,
        },
      },
      data: { taps: { increment: 1 } },
      select: { taps: true },
    });
    return afterTap;
  }

  async updateUserScore(
    userId: number,
    roundId: number,
    scoreIncrement: number,
    tx?: TransactionOrClient,
  ): Promise<RoundPlayer> {
    const client = this.getClient(tx);
    return client.roundPlayer.update({
      where: {
        userId_roundId: {
          userId,
          roundId,
        },
      },
      data: { score: { increment: scoreIncrement } },
    });
  }

  async updateRoundTotalScore(
    roundId: number,
    scoreIncrement: number,
    tx?: TransactionOrClient,
  ): Promise<Round> {
    const client = this.getClient(tx);
    return client.round.update({
      where: { id: roundId },
      data: { totalScore: { increment: scoreIncrement } },
    });
  }

  async getRound(id: number, tx?: TransactionOrClient): Promise<Round | null> {
    const client = this.getClient(tx);
    return client.round.findUnique({
      where: { id },
      include: { roundPlayers: { include: { user: true } } },
    });
  }

  async createRound(
    roundPayload: CreateRoundDto & {
      adminId: number;
      startTime: Date;
      endTime: Date;
    },
    tx?: TransactionOrClient,
  ): Promise<Round> {
    const client = this.getClient(tx);
    return await client.round.create({
      data: {
        startTime: roundPayload.startTime,
        endTime: roundPayload.endTime,
        adminId: roundPayload.adminId,
        status: Status.cooldown,
        roundPlayers: {
          create: [
            {
              userId: roundPayload.adminId,
            },
          ],
        },
      },
    });
  }

  async updateRoundStatus(
    id: number,
    status: Status,
    tx?: TransactionOrClient,
  ): Promise<Round> {
    const client = this.getClient(tx);
    return client.round.update({
      where: { id },
      data: { status },
    });
  }

  async getRounds(tx?: TransactionOrClient): Promise<Round[]> {
    const client = this.getClient(tx);
    return client.round.findMany({
      orderBy: {
        id: 'desc',
      },
    });
  }

  async updateRound(
    id: number,
    roundPayload: CreateRoundDto & {
      adminId: number;
      startTime: Date;
      endTime: Date;
    },
    tx?: TransactionOrClient,
  ): Promise<Round> {
    const client = this.getClient(tx);
    return client.round.update({
      where: { id },
      data: roundPayload,
    });
  }
}
