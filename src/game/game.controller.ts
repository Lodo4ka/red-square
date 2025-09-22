import { Controller, Get, Body, Post, Param, UseGuards } from '@nestjs/common';
import { GameService } from './game.service';
import { CreateRoundDto } from './dto/create-round.dto';
import { JoinRoundDto } from './dto/join-round.dto';
import { IncrementTapDto } from './dto/increment-tap.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('game')
export class GameController {
  constructor(private readonly gameService: GameService) {}

  @Get()
  getAllRounds() {
    return this.gameService.getAllRounds();
  }

  @Post('/join')
  @UseGuards(JwtAuthGuard)
  joinRound(@Body() joinRoundDto: JoinRoundDto) {
    return this.gameService.joinRound(joinRoundDto);
  }

  @Post('/tap')
  @UseGuards(JwtAuthGuard)
  incrementTap(@Body() createRoundDto: IncrementTapDto) {
    return this.gameService.incrementTap(createRoundDto);
  }

  @Get(':id')
  getRound(@Param('id') id: string) {
    return this.gameService.getRound(parseInt(id));
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  createRound(@Body() createRoundDto: CreateRoundDto) {
    return this.gameService.createRound(createRoundDto);
  }
}
