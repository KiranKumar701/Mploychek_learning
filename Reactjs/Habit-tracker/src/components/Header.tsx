import { addWeeks, endOfWeek, format, isSameDay, startOfWeek } from "date-fns"
import type { Habit } from "../types/habit"
import { Button } from "./Button"

type HeaderProps = {
  habits: Habit[]
  weekStart: Date
  onPrevWeek: () => void
  onNextWeek: () => void
  onToday: () => void
}

export function Header({ habits, weekStart, onPrevWeek, onNextWeek, onToday }: HeaderProps) {
  const weekEnd = endOfWeek(weekStart, { weekStartsOn: 1 })
  const today = new Date()

  const completedToday = habits.filter((habit) =>
    habit.completions.some((completion) => isSameDay(new Date(completion), today))
  ).length

  const totalHabits = habits.length
  const progress = totalHabits === 0 ? 0 : Math.round((completedToday / totalHabits) * 100)

  return (
    <header className="rounded-2xl border border-zinc-800/80 bg-gradient-to-br from-zinc-900/90 to-zinc-950/90 p-6 shadow-xl shadow-black/30 backdrop-blur-sm">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-2">
          <div className="inline-flex w-fit items-center gap-2 rounded-full bg-violet-500/10 px-3 py-1 text-xs font-medium uppercase tracking-wider text-violet-300">
            Habit Tracker
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-50 sm:text-4xl">
            Build better routines
          </h1>
          <p className="text-sm text-zinc-400">
            {completedToday} / {totalHabits || 0} done today
            {totalHabits > 0 && ` · ${progress}% complete`}
          </p>
          {totalHabits > 0 && (
            <div className="mt-1 h-2 w-full max-w-xs overflow-hidden rounded-full bg-zinc-800">
              <div
                className="h-full rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          )}
        </div>

        <div className="flex flex-col items-start gap-2 sm:items-end">
          <span className="text-sm font-medium text-zinc-300">
            {format(startOfWeek(weekStart, { weekStartsOn: 1 }), "MMM d")} –{" "}
            {format(weekEnd, "MMM d, yyyy")}
          </span>
          <div className="flex items-center gap-2">
            <Button variant="secondary" className="rounded-lg px-3 py-1.5" onClick={onPrevWeek}>
              ← Prev
            </Button>
            <Button variant="secondary" className="rounded-lg px-3 py-1.5" onClick={onToday}>
              Today
            </Button>
            <Button
              variant="secondary"
              className="rounded-lg px-3 py-1.5"
              onClick={onNextWeek}
              disabled={startOfWeek(addWeeks(weekStart, 1), { weekStartsOn: 1 }) > today}
            >
              Next →
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
