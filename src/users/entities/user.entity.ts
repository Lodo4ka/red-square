import { Exclude, Expose } from 'class-transformer';
import { Role } from '@prisma/client';

export class UserEntity {
  @Expose()
  id: number;

  @Expose()
  name: string;

  @Expose()
  role: Role;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;

  @Exclude()
  password: string;
}
