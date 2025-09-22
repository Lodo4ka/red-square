import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class IncrementTapDto {
  @IsNotEmpty()
  @IsNumber()
  roundId: number;

  @IsOptional()
  @IsNumber()
  userId: number;
}
