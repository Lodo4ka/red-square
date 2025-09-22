import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class JoinRoundDto {
  @IsNotEmpty()
  @IsNumber()
  roundId: number;

  @IsOptional()
  @IsNumber()
  userId: number;
}
