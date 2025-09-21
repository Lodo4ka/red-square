import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateRoundDto {
  @IsNotEmpty()
  @IsNumber()
  adminId: number;
}
