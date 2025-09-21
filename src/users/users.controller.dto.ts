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

@Controller('users')
@UseInterceptors(ClassSerializerInterceptor)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto): Promise<UserEntity> {
    const user = await this.usersService.login(loginDto);
    return plainToInstance(UserEntity, user, { excludeExtraneousValues: true });
  }
}
