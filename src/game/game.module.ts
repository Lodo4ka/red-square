import { Module } from '@nestjs/common';
import { PrismaModule } from 'nestjs-prisma';
import { GameController } from './game.controller';
import { GameService } from './game.service';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { AttachUserToBodyInterceptor } from '../auth/attach-user.interceptor';
import { AuthModule } from '../auth/auth.module';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UsersRepository } from '../users/users.reposity';
import { UnitOfWork } from '../shared/uow/unit-of-work';
import { GameRepository } from './game.repository';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [GameController],
  providers: [
    GameService,
    JwtAuthGuard,
    GameRepository,
    UsersRepository,
    UnitOfWork,
    { provide: APP_INTERCEPTOR, useClass: AttachUserToBodyInterceptor },
  ],
})
export class GameModule {}
