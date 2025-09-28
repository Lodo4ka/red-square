import {
  Controller,
  Post,
  Body,
  UseInterceptors,
  ClassSerializerInterceptor,
  Get,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UserEntity } from './entities/user.entity';
import { AuthCookie } from '../auth/auth-cookie.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import {
  CurrentUser,
  CurrentUserPayload,
} from 'src/auth/current-user.decorator';
import { User } from '@prisma/client';

@Controller('users')
@UseInterceptors(ClassSerializerInterceptor)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('login')
  @AuthCookie('login')
  async login(@Body() loginDto: UserEntity): Promise<User> {
    return await this.usersService.login(loginDto);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getMe(@CurrentUser() user: CurrentUserPayload) {
    const result = await this.usersService.getCurrentUser(user.sub);
    console.log('result :>> ', result);
    return result;
  }

  @Post('logout')
  @AuthCookie('logout')
  logout() {
    return { success: true };
  }
}
