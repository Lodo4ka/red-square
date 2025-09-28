import { Controller, Get, Body, Post, Param, UseGuards } from '@nestjs/common';
import { GameService } from './game.service';
import { CreateRoundDto } from './dto/create-round.dto';
import { JoinRoundDto } from './dto/join-round.dto';
import { IncrementTapDto } from './dto/increment-tap.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import {
  CurrentUser,
  CurrentUserPayload,
} from '../auth/current-user.decorator';

@Controller('game')
export class GameController {
  constructor(private readonly gameService: GameService) {}

  @Get('rounds')
  getAllRounds() {
    return this.gameService.getAllRounds();
  }

  @Post('/join')
  @UseGuards(JwtAuthGuard)
  joinRound(
    @Body() joinRoundDto: JoinRoundDto,
    @CurrentUser() user: CurrentUserPayload,
  ) {
    return this.gameService.joinRound({ ...joinRoundDto, userId: user.sub });
  }

  @Post('/rounds/:id')
  @UseGuards(JwtAuthGuard)
  updateRound(
    @Param('id') id: string,
    @Body() incrementTapDto: IncrementTapDto,
  ) {
    return this.gameService.updateRound(parseInt(id), incrementTapDto);
  }

  @Get('rounds/:id')
  async getRound(@Param('id') id: string) {
    return await this.gameService.getRound(parseInt(id));
  }

  @Post('rounds')
  @UseGuards(JwtAuthGuard)
  createRound(@Body() createRoundDto: CreateRoundDto) {
    return this.gameService.createRound(createRoundDto);
  }
}
