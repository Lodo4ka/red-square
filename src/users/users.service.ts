import { Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginDto } from './dto/login';
import { PrismaService } from 'nestjs-prisma';
import { Role, User } from '@prisma/client';
import { hashPassword, verifyPassword } from './utils/password';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async createUser(name: string, password: string) {
    const targetName = name.toLowerCase();
    const hashedPassword = await hashPassword(password);
    if (targetName === Role.admin) {
      return this.prisma.user.create({
        data: {
          name,
          password: hashedPassword,
          role: Role.admin,
        },
      });
    } else if (targetName === Role.nikita) {
      return await this.prisma.user.create({
        data: {
          name,
          password: hashedPassword,
          role: Role.nikita,
        },
      });
    }
    return await this.prisma.user.create({
      data: {
        name,
        password: hashedPassword,
        role: Role.survivor,
      },
    });
  }

  async getCurrentUser(id: number) {
    return this.prisma.user.findUnique({
      where: {
        id,
      },
    });
  }

  async login(loginDto: LoginDto) {
    const { name, password } = loginDto;
    const user: User | null = await this.prisma.user.findUnique({
      where: {
        name,
      },
    });
    if (!user) {
      return this.createUser(name, password);
    }
    const isValid = await verifyPassword(password, user.password);
    if (!isValid) {
      throw new UnauthorizedException('Неверный пароль');
    }

    return user;
  }
}
