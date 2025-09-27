import { PrismaService } from 'nestjs-prisma';
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateRoundDto } from './dto/create-round.dto';
import { ConfigService } from '@nestjs/config';
import { addSeconds } from 'src/users/utils/date';
import { Prisma, Round, Status } from '@prisma/client';
import { JoinRoundDto } from './dto/join-round.dto';
import { IncrementTapDto } from './dto/increment-tap.dto';

@Injectable()
export class GameService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {}

  private computeExpectedStatus(
    round: Pick<Round, 'startTime' | 'endTime'>,
    now: Date = new Date(),
  ): Status {
    if (now < round.startTime) {
      return Status.cooldown;
    }
    if (now >= round.endTime) {
      return Status.finished;
    }
    return Status.active;
  }

  private async reconcileRoundStatus(
    round: Round,
    tx: Prisma.TransactionClient | PrismaService,
  ): Promise<Round> {
    const expected = this.computeExpectedStatus(round);
    if (expected !== round.status) {
      return await tx.round.update({
        where: { id: round.id },
        data: { status: expected },
      });
    }
    return round;
  }

  async createRound(createRoundDto: CreateRoundDto) {
    const admin = await this.prisma.user.findUnique({
      where: {
        id: createRoundDto.adminId,
      },
    });
    if (!admin) {
      throw new NotFoundException('такого админа не существует');
    }
    const cooldownDuration = Number(
      this.configService.get('COOLDOWN_DURATION'),
    );
    const roundDuration = Number(this.configService.get('ROUND_DURATION'));
    const startTime = addSeconds(new Date(), cooldownDuration);
    const endTime = addSeconds(startTime, roundDuration);
    const round = await this.prisma.round.create({
      data: {
        startTime,
        endTime,
        adminId: createRoundDto.adminId,
        status: Status.cooldown,
        roundPlayers: {
          create: [
            {
              userId: createRoundDto.adminId,
            },
          ],
        },
      },
    });
    return round;
  }

  async getAllRounds() {
    const rounds = await this.prisma.round.findMany({
      orderBy: {
        id: 'desc',
      },
    });
    const now = new Date();
    const updates = rounds.map(async (r) => {
      const expected = this.computeExpectedStatus(r, now);
      if (expected !== r.status) {
        return this.prisma.round.update({
          where: { id: r.id },
          data: { status: expected },
        });
      }
      return r;
    });
    return Promise.all(updates);
  }

  async getRound(id: number) {
    const round = await this.prisma.round.findUnique({
      where: {
        id,
      },
      include: { roundPlayers: true },
    });
    if (!round) {
      throw new NotFoundException('такой игры не существует');
    }
    return this.reconcileRoundStatus(round, this.prisma);
  }

  async joinRound(joinRoundDto: JoinRoundDto) {
    const round = await this.prisma.round.findUnique({
      where: {
        id: joinRoundDto.roundId,
      },
    });
    if (!round) {
      throw new NotFoundException('такой игры не существует');
    }
    await this.reconcileRoundStatus(round, this.prisma);
    const user = await this.prisma.user.findUnique({
      where: {
        id: joinRoundDto.userId,
      },
    });
    if (!user) {
      throw new NotFoundException('такого пользователя не существует');
    }
    return await this.prisma.round.update({
      where: {
        id: joinRoundDto.roundId,
      },
      data: {
        roundPlayers: {
          connectOrCreate: {
            where: {
              userId_roundId: {
                userId: joinRoundDto.userId,
                roundId: joinRoundDto.roundId,
              },
            },
            create: { userId: joinRoundDto.userId },
          },
        },
      },
      include: { roundPlayers: true },
    });
  }

  async updateRound(roundId: number, incrementTapDto: IncrementTapDto) {
    const { userId } = incrementTapDto;
    return await this.prisma.$transaction(async (tx) => {
      const currentRound = await tx.round.findUnique({
        where: {
          id: roundId,
        },
      });
      if (!currentRound) {
        throw new NotFoundException('такой игры не существует');
      }
      const reconciledRound = await this.reconcileRoundStatus(currentRound, tx);
      if (reconciledRound.status !== Status.active) {
        throw new NotFoundException('игра не активна');
      }
      // 1) Сначала инкрементируем taps и получаем новое значение
      const afterTap = await tx.roundPlayer.update({
        where: {
          userId_roundId: {
            userId,
            roundId,
          },
        },
        data: { taps: { increment: 1 } },
        select: { taps: true },
      });

      // 2) Рассчитываем бонус: каждый 11-й тап даёт +10 очков
      const isBonus = afterTap.taps % 11 === 0;
      const scoreIncrement = 1 + (isBonus ? 10 : 0);

      // 3) Обновляем score у игрока на рассчитанную дельту
      const updatedPlayer = await tx.roundPlayer.update({
        where: {
          userId_roundId: {
            userId,
            roundId,
          },
        },
        data: { score: { increment: scoreIncrement } },
      });

      // 4) Затем увеличиваем totalScore раунда на ту же дельту
      await tx.round.update({
        where: { id: roundId },
        data: { totalScore: { increment: scoreIncrement } },
      });

      return updatedPlayer;
    });
  }
}
