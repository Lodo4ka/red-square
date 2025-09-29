import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateRoundDto } from './dto/create-round.dto';
import { ConfigService } from '@nestjs/config';
import { addSeconds } from 'src/users/utils/date';
import { Round, Status } from '@prisma/client';
import { JoinRoundDto } from './dto/join-round.dto';
import { IncrementTapDto } from './dto/increment-tap.dto';
import { UsersRepository } from '../users/users.reposity';
import { GameRepository } from './game.repository';
import { TransactionOrClient, UnitOfWork } from '../shared/uow/unit-of-work';

@Injectable()
export class GameService {
  constructor(
    private readonly configService: ConfigService,
    private readonly usersRepository: UsersRepository,
    private readonly gameRepository: GameRepository,
    private readonly unitOfWork: UnitOfWork,
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
    tx?: TransactionOrClient,
  ): Promise<Round> {
    const expected = this.computeExpectedStatus(round);
    if (expected !== round.status) {
      return await this.gameRepository.updateRoundStatus(
        round.id,
        expected,
        tx,
      );
    }
    return round;
  }

  async createRound(createRoundDto: CreateRoundDto) {
    const admin = await this.usersRepository.findUserById(
      createRoundDto.adminId,
    );
    if (!admin) {
      throw new NotFoundException('такого админа не существует');
    }
    const cooldownDuration = Number(
      this.configService.get('COOLDOWN_DURATION'),
    );
    const roundDuration = Number(this.configService.get('ROUND_DURATION'));
    const startTime = addSeconds(new Date(), cooldownDuration);
    const endTime = addSeconds(startTime, roundDuration);

    return await this.gameRepository.createRound({
      ...createRoundDto,
      startTime,
      endTime,
    });
  }

  async getAllRounds() {
    const rounds = await this.gameRepository.getRounds();
    const now = new Date();
    const updates = rounds.map(async (r) => {
      const expected = this.computeExpectedStatus(r, now);
      if (expected !== r.status) {
        return this.gameRepository.updateRoundStatus(r.id, expected);
      }
      return r;
    });
    return Promise.all(updates);
  }

  async getRound(id: number): Promise<Round> {
    const round = await this.gameRepository.getRound(id);
    if (!round) {
      throw new NotFoundException('такой игры не существует');
    }
    return await this.reconcileRoundStatus(round);
  }

  async joinRound(joinRoundDto: JoinRoundDto & { userId: number }) {
    const round = await this.gameRepository.findRoundById(joinRoundDto.roundId);
    if (!round) {
      throw new NotFoundException('такой игры не существует');
    }
    await this.reconcileRoundStatus(round);
    const user = await this.usersRepository.findUserById(joinRoundDto.userId);
    if (!user) {
      throw new NotFoundException('такого пользователя не существует');
    }
    return await this.gameRepository.joinRound(
      joinRoundDto.roundId,
      joinRoundDto.userId,
    );
  }

  async updateRound(roundId: number, incrementTapDto: IncrementTapDto) {
    const { userId } = incrementTapDto;
    return await this.unitOfWork.execute(async (tx) => {
      const currentRound = await this.gameRepository.findRoundById(roundId, tx);
      if (!currentRound) {
        throw new NotFoundException('такой игры не существует');
      }
      const reconciledRound = await this.reconcileRoundStatus(currentRound, tx);
      if (reconciledRound.status !== Status.active) {
        throw new NotFoundException('игра не активна');
      }
      // 1) Сначала инкрементируем taps и получаем новое значение
      const afterTap = await this.gameRepository.incrementUserTap(
        userId,
        roundId,
        tx,
      );
      // 2) Рассчитываем бонус: каждый 11-й тап даёт +10 очков
      const isBonus = afterTap.taps % 11 === 0;
      const scoreIncrement = 1 + (isBonus ? 10 : 0);
      // 3) Обновляем score у игрока на рассчитанную дельту
      const updatedPlayer = await this.gameRepository.updateUserScore(
        userId,
        roundId,
        scoreIncrement,
        tx,
      );
      // 4) Затем увеличиваем totalScore раунда на ту же дельту
      const updatedRound = await this.gameRepository.updateRoundTotalScore(
        roundId,
        scoreIncrement,
        tx,
      );
      if (updatedRound.version !== reconciledRound.version + 1) {
        throw new ConflictException('игра была изменена другим пользователем');
      }
      return updatedPlayer;
    });
  }
}
