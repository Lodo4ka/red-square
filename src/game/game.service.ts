import { PrismaService } from 'nestjs-prisma';
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateRoundDto } from './dto/create-round.dto';
import { ConfigService } from '@nestjs/config';
import { toMilliseconds } from 'src/users/utils/date';
import { Status } from '@prisma/client';

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
}
