import { IsNotEmpty, IsNumber } from 'class-validator';

export class JoinRoundDto {
  @IsNotEmpty()
  @IsNumber()
  roundId: number;

  @IsNotEmpty()
  @IsNumber()
  userId: number;
}
