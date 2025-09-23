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
import { LoginDto } from './dto/login';
import { UserEntity } from './entities/user.entity';
import { plainToInstance } from 'class-transformer';
import { AuthCookie } from '../auth/auth-cookie.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import {
  CurrentUser,
  CurrentUserPayload,
} from 'src/auth/current-user.decorator';

@Controller('users')
@UseInterceptors(ClassSerializerInterceptor)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('login')
  @AuthCookie('login')
  async login(@Body() loginDto: LoginDto): Promise<UserEntity> {
    const user = await this.usersService.login(loginDto);
    return plainToInstance(UserEntity, user, { excludeExtraneousValues: true });
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getMe(@CurrentUser() user: CurrentUserPayload) {
    const entity = await this.usersService.getCurrentUser(user.sub);
    return plainToInstance(UserEntity, entity, {
      excludeExtraneousValues: true,
    });
  }

  @Post('logout')
  @AuthCookie('logout')
  logout() {
    return { success: true };
  }
}
