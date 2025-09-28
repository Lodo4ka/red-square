import { Module } from '@nestjs/common';
import { PrismaModule } from 'nestjs-prisma';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { AuthModule } from '../auth/auth.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { SetAuthCookieInterceptor } from '../auth/set-auth-cookie.interceptor';
import { UsersRepository } from './users.reposity';

@Module({
  imports: [PrismaModule, AuthModule],
  providers: [
    UsersService,
    UsersRepository,
    { provide: APP_INTERCEPTOR, useClass: SetAuthCookieInterceptor },
  ],
  controllers: [UsersController],
})
export class UsersModule {}
