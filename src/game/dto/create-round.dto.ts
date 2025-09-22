import { IsNumber, IsOptional } from 'class-validator';

export class CreateRoundDto {
  @IsOptional()
  @IsNumber()
  adminId: number;
}
