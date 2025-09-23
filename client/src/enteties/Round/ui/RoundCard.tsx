import * as React from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/shared/ui'
import { Separator } from '@/shared/ui'
import { formatDate } from '@/shared/lib/utils'
import { cn } from '@/shared/lib/utils'

interface RoundCardProps {
  id: number
  startAt: string | Date
  endAt: string | Date
  status: string
  className?: string
  onClick?: () => void
}

export const RoundCard: React.FC<RoundCardProps> = ({ id, startAt, endAt, status, className, onClick }) => {
  return (
    <Card className={cn("bg-muted/10", className)} onClick={onClick}>
      <CardHeader className="flex flex-row items-start gap-3">
        <span className="mt-2 inline-block h-2 w-2 rounded-full bg-foreground" />
        <div>
          <CardTitle className="text-lg font-semibold">Round ID: {id}</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="grid gap-3 text-base tabular-nums tracking-wide">
          <div className="grid grid-cols-[72px_1fr] items-baseline gap-x-4">
            <span className="text-muted-foreground">Start:</span>
            <span>{formatDate(startAt)}</span>
          </div>
          <div className="grid grid-cols-[72px_1fr] items-baseline gap-x-4">
            <span className="text-muted-foreground">End:</span>
            <span>{formatDate(endAt)}</span>
          </div>
        </div>

        <div className="my-5">
          <Separator />
        </div>

        <CardDescription className="text-base text-foreground">
          <span className="text-muted-foreground mr-2">Статус:</span>
          <span className="font-medium">{status}</span>
        </CardDescription>
      </CardContent>
    </Card>
  )
}

