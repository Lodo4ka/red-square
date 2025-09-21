import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';

@Injectable()
export class AppService {
  constructor(private prisma: PrismaService) {}

  getHello(): string {
    return 'Hello World!';
  }

  async getUsers(): Promise<User[]> {
    return this.prisma.user.findMany();
  }

  async createUser(user: User): Promise<User> {
    return this.prisma.user.create({ data: user });
  }
}
