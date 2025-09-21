import { Controller, Get, Body, Post, Param } from '@nestjs/common';
import { GameService } from './game.service';
import { CreateRoundDto } from './dto/create-round.dto';

@Controller('game')
export class GameController {
  constructor(private readonly gameService: GameService) {}

  @Get()
  getAllRounds() {
    return this.gameService.getAllRounds();
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
