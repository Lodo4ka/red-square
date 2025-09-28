import * as React from 'react';
import type { Round } from '@/enteties/Round/type';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Separator,
} from '@/shared/ui';
import { cn, formatDate, clamp, formatDuration } from '@/shared/lib/utils';

type RoundStatsProps = {
  round: Round;
  className?: string;
};

const statusStyles: Record<Round['status'], string> = {
  active: 'bg-emerald-500/15 text-emerald-600 ring-1 ring-emerald-500/30',
  finished: 'bg-muted text-muted-foreground ring-1 ring-border',
  cooldown: 'bg-amber-500/15 text-amber-600 ring-1 ring-amber-500/30',
};

export const RoundStats: React.FC<RoundStatsProps> = ({ round, className }) => {
  const now = new Date();
  const start = new Date(round.startTime);
  const end = new Date(round.endTime);

  const totalMs = Math.max(0, end.getTime() - start.getTime());
  const rawElapsed = now.getTime() - start.getTime();
  const elapsedMs = clamp(rawElapsed, 0, totalMs);
  const remainingMs = clamp(totalMs - elapsedMs, 0, totalMs);
  const progress = totalMs === 0 ? 0 : Math.round((elapsedMs / totalMs) * 100);
  const progressPct = round.status === 'finished' ? 100 : progress;

  return (
    <Card className={cn('bg-muted/10', className)}>
      <CardHeader className="flex flex-row items-start gap-3">
        <span className="mt-2 inline-block h-2 w-2 rounded-full bg-foreground" />
        <div className="flex-1">
          <CardTitle className="text-lg font-semibold">
            Статистика раунда
          </CardTitle>
          <CardDescription className="text-base">
            ID: {round.id}
          </CardDescription>
        </div>
        <div
          className={cn(
            'rounded-full px-3 py-1 text-sm font-medium',
            statusStyles[round.status],
          )}
        >
          {round.status}
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="grid gap-3 text-base tabular-nums tracking-wide">
          <div className="grid grid-cols-[120px_1fr] items-baseline gap-x-4">
            <span className="text-muted-foreground">Начало:</span>
            <span>{formatDate(start)}</span>
          </div>
          <div className="grid grid-cols-[120px_1fr] items-baseline gap-x-4">
            <span className="text-muted-foreground">Конец:</span>
            <span>{formatDate(end)}</span>
          </div>
          <div className="grid grid-cols-[120px_1fr] items-baseline gap-x-4">
            <span className="text-muted-foreground">Длительность:</span>
            <span>{formatDuration(totalMs)}</span>
          </div>
          <div className="grid grid-cols-[120px_1fr] items-baseline gap-x-4">
            <span className="text-muted-foreground">Прошло:</span>
            <span>{formatDuration(elapsedMs)}</span>
          </div>
          <div className="grid grid-cols-[120px_1fr] items-baseline gap-x-4">
            <span className="text-muted-foreground">Осталось:</span>
            <span>{formatDuration(remainingMs)}</span>
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-muted-foreground">Игроки:</span>
          </div>
          {round.roundPlayers.map((roundPlayer) => (
            <div key={roundPlayer.id} className="grid grid-cols-[120px_1fr] items-baseline gap-x-4">
              <span className="text-muted-foreground">
                {roundPlayer.user.name}
              </span>
              <span className="font-medium">{roundPlayer.score}</span>
            </div>
          ))}
        </div>

        <div className="my-5">
          <Separator />
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between text-sm text-muted-foreground">
            <span>Прогресс</span>
            <span className="tabular-nums">{progressPct}%</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
            <div
              className={cn(
                'h-full rounded-full bg-foreground transition-[width] duration-500 ease-out',
              )}
              style={{ width: `${progressPct}%` }}
            />
          </div>
          <div className="mt-2 flex justify-between text-xs text-muted-foreground tabular-nums">
            <span>{formatDate(start)}</span>
            <span>{formatDate(end)}</span>
          </div>
        </div>

        <div className="my-5">
          <Separator />
        </div>

        <div className="grid grid-cols-2 gap-3 text-base tabular-nums max-[420px]:grid-cols-1">
          <div className="grid grid-cols-[120px_1fr] items-baseline gap-x-4">
            <span className="text-muted-foreground">Итоговый счёт:</span>
            <span className="font-medium">{round.totalScore}</span>
          </div>
          <div className="grid grid-cols-[120px_1fr] items-baseline gap-x-4">
            <span className="text-muted-foreground">Админ:</span>
            <span>#{round.adminId}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
