import type { Round } from "@/enteties/Round/type"
import { cn, formatMsToHHMMSS, reloadPage } from "@/shared/lib/utils"
import { useEffect, useMemo, useState } from "react"
import { useSelector } from "react-redux";
import { type UserStore } from "@/enteties/User/model";
import { useUpdateRoundMutation } from "../api/game";
import { useErrorModal } from "@/shared/context/use-error-modal";

export const GameCard = ({ round }: { round: Round }) => {
  const user = useSelector((state: { user: { user: UserStore } }) => {
    return state.user?.user;
  });
  const [myScore, setMyScore] = useState(round.roundPlayers?.find(player => player.userId === user?.id)?.score || 0)
  const [updateRound] = useUpdateRoundMutation();
  const { showError } = useErrorModal();

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

  const [timeLeft, setTimeLeft] = useState<string>(() => {
    const currentTime = round.status === 'active' ? new Date(round.endTime) : new Date(round.startTime)
    const endMs = Number(currentTime);
    const msLeft = Number.isFinite(endMs) ? Math.max(0, endMs - Date.now()) : 0
    return formatMsToHHMMSS(msLeft)
  })

  useEffect(() => {
    const compute = () => {
      const targetTime = round.status === 'active' ? round.endTime : round.startTime
      const endMs = Number(new Date(targetTime))
      const msLeft = Number.isFinite(endMs) ? Math.max(0, endMs - Date.now()) : 0
      if (msLeft === 0 && (round.status === 'cooldown' || round.status === 'finished')) {
        return reloadPage()
      }
      setTimeLeft(formatMsToHHMMSS(msLeft))
    }
    compute()
    const intervalId = setInterval(compute, 1000)
    return () => clearInterval(intervalId)
  }, [round.startTime, round.endTime, round.status])

  const requestUpdateRound = async () => {
    try {
      const { data } = await updateRound({ id: String(round.id), userId: user?.id })
      if (!data) return
      const { score } = data;
      setMyScore(score)
    } catch {
      showError('Не удалось отправить тап')
    }
  }

  const [isPressed, setIsPressed] = useState(false)
  const [tapEffects, setTapEffects] = useState<Array<{ id: number; x: number; y: number }>>([])
  const addTapEffect = (e: React.PointerEvent<HTMLDivElement>) => {
    if (round.status !== 'active') return
    setIsPressed(true)
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const id = Date.now() + Math.random()
    setTapEffects(prev => [...prev, { id, x, y }])
    window.setTimeout(async () => {
      setTapEffects(prev => prev.filter(effect => effect.id !== id))
      requestUpdateRound();
    }, 750)
  }

  return (
    <div className="w-full flex flex-col items-center">
      <div
        className={cn(
          "relative w-full flex flex-col items-center gap-3 py-6 select-none transition-transform duration-150 ease-out",
          round.status === 'active' ? "cursor-pointer active:scale-[.985]" : "cursor-default",
          isPressed && round.status === 'active' && "scale-[.985]"
        )}
        onPointerDown={round.status === 'active' ? addTapEffect : undefined}
        onPointerUp={() => setIsPressed(false)}
        onPointerLeave={() => setIsPressed(false)}
        onPointerCancel={() => setIsPressed(false)}
      >
        {rows.map((row, idx) => {
          return (
            <div
              key={idx}
              className="relative h-3 rounded-full border border-zinc-300 bg-[radial-gradient(theme(colors.zinc.300)_1px,transparent_1px)] [background-size:6px_6px]"
              style={{ width: row.outer, maxWidth: "90%" }}
            >
              {row.inner > 0 && (
                <div
                  className={cn(
                    "absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-2 rounded-full bg-zinc-800 transition-colors duration-150",
                    isPressed && "bg-zinc-900"
                  )}
                  style={{ width: row.inner }}
                />
              )}
            </div>
          )
        })}

        {tapEffects.map(effect => (
          <div
            key={effect.id}
            className="absolute z-10 pointer-events-none tap-float select-none"
            style={{ left: effect.x, top: effect.y }}
          >
            <span className="text-zinc-900 text-sm font-semibold drop-shadow-[0_1px_0_rgba(255,255,255,0.6)]">+1</span>
          </div>
        ))}
      </div>

      <div className="mt-2 flex flex-col items-center text-center">
        <p className={cn("text-xl font-medium text-zinc-800", roundStatus?.color)}>{roundStatus?.text}</p>
        <p className="text-zinc-600 mt-1">До конца осталось: <span className="tabular-nums font-medium text-zinc-900">{timeLeft}</span></p>
        <p className="text-zinc-600 mt-1">Мои очки — <span className="font-medium text-zinc-900">{myScore}</span></p>
      </div>
    </div>
  )
}
