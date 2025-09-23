export type Status = 'active' | 'finished' | 'cooldown';

export type RoundPlayer = {
  id: number;
  score: number;
  userId: number;
  roundId: number;
  taps: number;
}

export type Round = {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  startTime: Date;
  endTime: Date;
  adminId: number;
  totalScore: number;
  status: Status;
  roundPlayers: RoundPlayer[];
}
