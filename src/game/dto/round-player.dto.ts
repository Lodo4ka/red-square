import { Expose, Type } from 'class-transformer';
import { UserEntity } from 'src/users/entities/user.entity';

export class RoundPlayerDto {
  @Expose()
  id: number;

  @Expose()
  score: number;

  @Expose()
  taps: number;

  @Expose()
  userId: number;

  @Expose()
  roundId: number;

  @Expose()
  @Type(() => UserEntity)
  user: UserEntity;
}
