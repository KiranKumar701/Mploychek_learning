import {
  eachDayOfInterval,
  endOfWeek,
  format,
  isFuture,
  isSameDay,
  isToday,
  startOfWeek,
} from "date-fns"
import type { Habit } from "../types/habit"
import { calculateStreak } from "../utils/streak"
import { Button } from "./Button"

type HabitListProps = {
  habits: Habit[]
  weekStart: Date
  deleteHabit: (id: string) => void
  toggleHabit: (id: string, date: Date) => void
}

export function HabitList({ habits, weekStart, deleteHabit, toggleHabit }: HabitListProps) {
  if (habits.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-zinc-700/80 bg-zinc-900/40 px-6 py-12 text-center backdrop-blur-sm">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-500/10 text-2xl">
          ✨
        </div>
        <h2 className="text-lg font-semibold text-zinc-100">No habits yet</h2>
        <p className="mt-2 text-sm text-zinc-400">
          Add your first habit above and start building consistency.
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      {habits.map((habit) => (
        <HabitItem
          key={habit.id}
          habit={habit}
          weekStart={weekStart}
          deleteHabit={deleteHabit}
          toggleHabit={toggleHabit}
        />
      ))}
    </div>
  )
}

type HabitItemProps = {
  habit: Habit
  weekStart: Date
  deleteHabit: (id: string) => void
  toggleHabit: (id: string, date: Date) => void
}

function HabitItem({ habit, weekStart, deleteHabit, toggleHabit }: HabitItemProps) {
  const visibleDates = eachDayOfInterval({
    start: startOfWeek(weekStart, { weekStartsOn: 1 }),
    end: endOfWeek(weekStart, { weekStartsOn: 1 }),
  })

  const streak = calculateStreak(habit.completions)
  const weekCompletions = visibleDates.filter((date) =>
    habit.completions.some((completion) => isSameDay(new Date(completion), date))
  ).length

  return (
    <article className="group rounded-2xl border border-zinc-800/80 bg-zinc-900/70 p-5 shadow-lg shadow-black/20 backdrop-blur-sm transition hover:border-violet-500/30">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="flex flex-col gap-1">
          <h3 className="text-lg font-semibold text-zinc-50">{habit.name}</h3>
          <div className="flex items-center gap-3 text-sm">
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2.5 py-0.5 font-medium text-amber-300">
              🔥 {streak} day streak
            </span>
            <span className="text-zinc-500">
              {weekCompletions}/{visibleDates.length} this week
            </span>
          </div>
        </div>
        <Button
          onClick={() => deleteHabit(habit.id)}
          variant="ghost-destructive"
          className="rounded-lg px-3 py-1.5 text-sm opacity-70 transition group-hover:opacity-100"
        >
          Delete
        </Button>
      </div>

      <div className="grid grid-cols-7 gap-2">
        {visibleDates.map((date) => {
          const completed = habit.completions.some((completion) =>
            isSameDay(new Date(completion), date)
          )
          const future = isFuture(date)
          const today = isToday(date)

          return (
            <Button
              key={date.toISOString()}
              className={`flex flex-col items-center gap-1 rounded-xl px-1 py-2.5 text-xs ${
                today ? "ring-2 ring-violet-400/50 ring-offset-2 ring-offset-zinc-900" : ""
              }`}
              disabled={future}
              onClick={() => toggleHabit(habit.id, date)}
              variant={completed ? "primary" : "secondary"}
            >
              <span className="font-medium uppercase tracking-wide">{format(date, "EEE")}</span>
              <span className="text-sm">{format(date, "d")}</span>
              {completed && <span className="text-[10px] text-violet-200">✓</span>}
            </Button>
          )
        })}
      </div>
    </article>
  )
}
