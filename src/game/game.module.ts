import { Module } from '@nestjs/common';
import { PrismaModule } from 'nestjs-prisma';
import { GameController } from './game.controller';
import { GameService } from './game.service';

@Module({
  imports: [PrismaModule],
  controllers: [GameController],
  providers: [GameService],
})
export class GameModule {}
