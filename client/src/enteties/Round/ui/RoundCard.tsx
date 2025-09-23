import * as React from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/shared/ui'
import { Separator } from '@/shared/ui'

interface RoundCardProps {
  id: string
  startAt: string | Date
  endAt: string | Date
  status: string
}

function formatDate(value: string | Date) {
  const date = typeof value === 'string' ? new Date(value) : value
  const d = new Intl.DateTimeFormat('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date)
  const t = new Intl.DateTimeFormat('ru-RU', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }).format(date)
  return `${d}, ${t}`
}

export const RoundCard: React.FC<RoundCardProps> = ({ id, startAt, endAt, status }) => {
  return (
    <Card className="bg-muted/10">
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

