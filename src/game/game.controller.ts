import { Controller, Get, Body, Post, Param } from '@nestjs/common';
import { GameService } from './game.service';
import { CreateRoundDto } from './dto/create-round.dto';
import { JoinRoundDto } from './dto/join-round.dto';
import { IncrementTapDto } from './dto/increment-tap.dto';

@Controller('game')
export class GameController {
  constructor(private readonly gameService: GameService) {}

  @Get()
  getAllRounds() {
    return this.gameService.getAllRounds();
  }

  @Post('/join')
  joinRound(@Body() joinRoundDto: JoinRoundDto) {
    return this.gameService.joinRound(joinRoundDto);
  }

  @Post('/tap')
  incrementTap(@Body() createRoundDto: IncrementTapDto) {
    return this.gameService.incrementTap(createRoundDto);
  }

  @Get(':id')
  getRound(@Param('id') id: string) {
    return this.gameService.getRound(parseInt(id));
  }

  @Post()
  createRound(@Body() createRoundDto: CreateRoundDto) {
    return this.gameService.createRound(createRoundDto);
  }
}
