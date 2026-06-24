import { isSameDay, subDays } from "date-fns"

export function calculateStreak(completions: string[], referenceDate = new Date()): number {
  if (completions.length === 0) return 0

  const completionDates = completions.map((date) => new Date(date))
  let streak = 0
  let cursor = new Date(referenceDate)
  cursor.setHours(0, 0, 0, 0)

  const hasCompletionOn = (date: Date) =>
    completionDates.some((completion) => isSameDay(completion, date))

  if (!hasCompletionOn(cursor)) {
    cursor = subDays(cursor, 1)
  }

  while (hasCompletionOn(cursor)) {
    streak += 1
    cursor = subDays(cursor, 1)
  }

  return streak
}
