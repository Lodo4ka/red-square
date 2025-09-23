import type { Round } from "@/enteties/Round/type"
import { cn } from "@/shared/lib/utils"
import { useEffect, useMemo, useState } from "react"

export const GameCard = ({ round }: { round: Round }) => {
  const rows = useMemo(
    () => [
      { outer: 220, inner: 0 },
      { outer: 260, inner: 160 },
      { outer: 300, inner: 220 },
      { outer: 320, inner: 240 },
      { outer: 340, inner: 260 },
      { outer: 340, inner: 260 },
      { outer: 360, inner: 260 },
      { outer: 420, inner: 220 },
      { outer: 440, inner: 320 },
      { outer: 440, inner: 0 },
      { outer: 420, inner: 300 },
      { outer: 360, inner: 280 },
    ],
    []
  )

  const roundStatus = useMemo(() => {
    switch (round.status) {
      case 'active':
        return {
          text: 'Раунд активен!',
          color: 'text-zinc-800',
        }
      case 'finished':
        return {
          text: 'Раунд завершен!',
          color: 'text-zinc-800',
        }
      case 'cooldown':
        return {
          text: 'Раунд на паузе!',
          color: 'text-zinc-800',
        }
      default:
        return {
          text: 'Раунд на паузе!',
          color: 'text-zinc-800',
        }
    }
  }, [round]);

  const formatMsToHHMMSS = (ms: number) => {
    const totalSeconds = Math.max(0, Math.floor(ms / 1000))
    const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, "0")
    const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, "0")
    const seconds = String(totalSeconds % 60).padStart(2, "0")
    return `${hours}:${minutes}:${seconds}`
  }

  const [timeLeft, setTimeLeft] = useState<string>(() => {
    const endMs = Number(new Date(round.endTime))
    const msLeft = Number.isFinite(endMs) ? Math.max(0, endMs - Date.now()) : 0
    return formatMsToHHMMSS(msLeft)
  })

  useEffect(() => {
    const compute = () => {
      const endMs = Number(new Date(round.endTime))
      const msLeft = Number.isFinite(endMs) ? Math.max(0, endMs - Date.now()) : 0
      setTimeLeft(formatMsToHHMMSS(msLeft))
    }
    compute()
    const intervalId = setInterval(compute, 1000)
    return () => clearInterval(intervalId)
  }, [round.endTime])

  return (
    <div className="w-full flex flex-col items-center">
      <div className="w-full flex flex-col items-center gap-3 py-6 select-none">
        {rows.map((row, idx) => {
          return (
            <div
              key={idx}
              className="relative h-3 rounded-full border border-zinc-300 bg-[radial-gradient(theme(colors.zinc.300)_1px,transparent_1px)] [background-size:6px_6px]"
              style={{ width: row.outer, maxWidth: "90%" }}
            >
              {row.inner > 0 && (
                <div
                  className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-2 rounded-full bg-zinc-800"
                  style={{ width: row.inner }}
                />
              )}
            </div>
          )
        })}
      </div>

      <div className="mt-2 flex flex-col items-center text-center">
        <p className={cn("text-xl font-medium text-zinc-800", roundStatus?.color)}>{roundStatus?.text}</p>
        <p className="text-zinc-600 mt-1">До конца осталось: <span className="tabular-nums font-medium text-zinc-900">{timeLeft}</span></p>
        <p className="text-zinc-600 mt-1">Мои очки — <span className="font-medium text-zinc-900">{round.totalScore}</span></p>
      </div>
    </div>
  )
}
