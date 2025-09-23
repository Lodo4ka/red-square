import { useMemo } from "react"

// Simple visual composed of stacked dotted bars with a dark inner segment
export const GameView = () => {
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
        <p className="text-xl font-medium text-zinc-800">Раунд активен!</p>
        <p className="text-zinc-600 mt-1">До конца осталось: <span className="tabular-nums font-medium text-zinc-900">00:23</span></p>
        <p className="text-zinc-600 mt-1">Мои очки — <span className="font-medium text-zinc-900">123</span></p>
      </div>
    </div>
  )
}
