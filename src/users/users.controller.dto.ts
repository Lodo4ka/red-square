import {
  Controller,
  Post,
  Body,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { LoginDto } from './dto/login';
import { UserEntity } from './entities/user.entity';
import { plainToInstance } from 'class-transformer';
import { AuthCookie } from '../auth/auth-cookie.decorator';

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

  @Post('logout')
  @AuthCookie('logout')
  logout() {
    return { success: true };
  }
}
