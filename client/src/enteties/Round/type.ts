export type Status = 'active' | 'finished' | 'cooldown';

export type Round = {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  startTime: Date;
  endTime: Date;
  adminId: number;
  totalScore: number;
  status: Status;
}
