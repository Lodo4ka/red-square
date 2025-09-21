import { PrismaService } from 'nestjs-prisma';
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateRoundDto } from './dto/create-round.dto';
import { ConfigService } from '@nestjs/config';
import { toMilliseconds } from 'src/users/utils/date';
import { Status } from '@prisma/client';
import { JoinRoundDto } from './dto/join-round.dto';

@Injectable()
export class GameService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {}

  async createRound(createRoundDto: CreateRoundDto) {
    const admin = await this.prisma.user.findUnique({
      where: {
        id: createRoundDto.adminId,
      },
    });
    if (!admin) {
      throw new NotFoundException('такого админа не существует');
    }
    const cooldownDuration = this.configService.get<number>(
      'COOLDOWN_DURATION',
    ) as number;
    const roundDuration = this.configService.get<number>(
      'ROUND_DURATION',
    ) as number;
    const startTime = new Date(
      new Date().getTime() + toMilliseconds(cooldownDuration),
    );
    const endTime = new Date(
      startTime.getTime() + toMilliseconds(roundDuration),
    );
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
    return this.prisma.round.findMany();
  }

  async getRound(id: number) {
    const round = await this.prisma.round.findUnique({
      where: {
        id,
      },
    });
    if (!round) {
      throw new NotFoundException('такой игры не существует');
    }
    return round;
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

  // async incrementTap(incrementTapDto: IncrementTapDto) {
  //   return await this.prisma.roundPlayer.update({
  //     where: {
  //       userId_roundId: {
  //         userId: incrementTapDto.userId,
  //         roundId: incrementTapDto.roundId,
  //       },
  //     },
  //     data: { taps: { increment: 1 } },
  //   });
  // }
}
