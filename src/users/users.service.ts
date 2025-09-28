import { Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginDto } from './dto/login';
import { PrismaService } from 'nestjs-prisma';
import { Role, User } from '@prisma/client';
import { hashPassword, verifyPassword } from './utils/password';
import { UsersRepository } from './users.reposity';

@Injectable()
export class UsersService {
  constructor(private usersRepository: UsersRepository) {}

  async createUser(name: string, password: string) {
    const targetName = name.toLowerCase();
    const hashedPassword = await hashPassword(password);
    if (targetName === Role.admin) {
      return this.usersRepository.createUser(name, hashedPassword);
    } else if (targetName === Role.nikita) {
      return this.usersRepository.createUser(name, hashedPassword);
    }
    return this.usersRepository.createUser(name, hashedPassword);
  }

  async getCurrentUser(id: number) {
    return this.usersRepository.findUserById(id);
  }

  async login(loginDto: LoginDto) {
    const { name, password } = loginDto;
    const user: User | null = await this.usersRepository.findUserByName(name);
    if (!user) {
      return this.usersRepository.createUser(name, password);
    }
    const isValid = await verifyPassword(password, user.password);
    if (!isValid) {
      throw new UnauthorizedException('Неверный пароль');
    }

    return user;
  }
}
