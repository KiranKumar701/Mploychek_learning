import { addWeeks, startOfWeek } from "date-fns"
import { useCallback, useEffect, useState } from "react"
import * as habitsApi from "./api/habits"
import { HabitForm } from "./components/HabitForm"
import { HabitList } from "./components/HabitList"
import { Header } from "./components/Header"
import type { Habit } from "./types/habit"

export default function App() {
  const [habits, setHabits] = useState<Habit[]>([])
  const [weekStart, setWeekStart] = useState(() => startOfWeek(new Date(), { weekStartsOn: 1 }))
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const loadHabits = useCallback(async () => {
    try {
      setError(null)
      const data = await habitsApi.fetchHabits()
      setHabits(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load habits")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadHabits()
  }, [loadHabits])

  async function addHabit(name: string) {
    setIsSubmitting(true)
    try {
      const habit = await habitsApi.createHabit(name)
      setHabits((current) => [habit, ...current])
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add habit")
    } finally {
      setIsSubmitting(false)
    }
  }

  async function deleteHabit(id: string) {
    try {
      await habitsApi.deleteHabit(id)
      setHabits((current) => current.filter((habit) => habit.id !== id))
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete habit")
    }
  }

  async function toggleHabit(id: string, date: Date) {
    try {
      const updated = await habitsApi.toggleHabitCompletion(id, date)
      setHabits((current) => current.map((habit) => (habit.id === id ? updated : habit)))
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update habit")
    }
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-violet-950/40 via-zinc-950 to-zinc-950">
      <div className="mx-auto flex max-w-3xl flex-col gap-6 px-4 py-8 sm:px-6 sm:py-12">
        <Header
          habits={habits}
          weekStart={weekStart}
          onPrevWeek={() => setWeekStart((current) => addWeeks(current, -1))}
          onNextWeek={() => setWeekStart((current) => addWeeks(current, 1))}
          onToday={() => setWeekStart(startOfWeek(new Date(), { weekStartsOn: 1 }))}
        />

        {error && (
          <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
            {error}
            <button
              className="ml-3 underline hover:no-underline"
              onClick={() => {
                setLoading(true)
                loadHabits()
              }}
            >
              Retry
            </button>
          </div>
        )}

        <HabitForm addHabit={addHabit} isSubmitting={isSubmitting} />

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-violet-500 border-t-transparent" />
          </div>
        ) : (
          <HabitList
            habits={habits}
            weekStart={weekStart}
            deleteHabit={deleteHabit}
            toggleHabit={toggleHabit}
          />
        )}
      </div>
    </div>
  )
}
