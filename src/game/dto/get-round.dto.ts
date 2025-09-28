import { Status } from '@prisma/client';
import { IsNotEmpty, IsNumber } from 'class-validator';
import { RoundPlayerDto } from './round-player.dto';
import { Expose, Type } from 'class-transformer';

export class GetRoundDto {
  @IsNotEmpty()
  @IsNumber()
  id: number;

  @Expose()
  totalScore: number;

  @Expose()
  status: Status;

  @Expose()
  startTime: Date;

  @Expose()
  endTime: Date;

  @Expose()
  @Type(() => RoundPlayerDto)
  roundPlayers: RoundPlayerDto[];
}
