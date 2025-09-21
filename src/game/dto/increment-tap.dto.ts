import { IsNotEmpty, IsNumber } from 'class-validator';

export class IncrementTapDto {
  @IsNotEmpty()
  @IsNumber()
  roundId: number;

  @IsNotEmpty()
  @IsNumber()
  userId: number;
}
