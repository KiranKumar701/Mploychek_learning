import { useState, type SubmitEvent } from "react"
import { Button } from "./Button"

type HabitFormProps = {
  addHabit: (name: string) => Promise<void>
  isSubmitting?: boolean
}

export function HabitForm({ addHabit, isSubmitting = false }: HabitFormProps) {
  const [name, setName] = useState("")

  async function handleSubmit(e: SubmitEvent) {
    e.preventDefault()

    const trimmed = name.trim()
    if (trimmed === "") return

    await addHabit(trimmed)
    setName("")
  }

  return (
    <form
      className="rounded-2xl border border-zinc-800/80 bg-zinc-900/60 p-4 backdrop-blur-sm"
      onSubmit={handleSubmit}
    >
      <label htmlFor="habit-name" className="mb-2 block text-sm font-medium text-zinc-300">
        New habit
      </label>
      <div className="flex gap-2">
        <input
          id="habit-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="flex-1 rounded-xl border border-zinc-700/80 bg-zinc-950/80 px-4 py-2.5 text-zinc-50 outline-none transition placeholder:text-zinc-500 focus-visible:border-violet-500 focus-visible:ring-2 focus-visible:ring-violet-500/30"
          placeholder="e.g. Read for 20 minutes"
          disabled={isSubmitting}
        />
        <Button
          disabled={name.trim() === "" || isSubmitting}
          className="rounded-xl px-5 py-2.5 font-medium"
          type="submit"
        >
          {isSubmitting ? "Adding..." : "Add Habit"}
        </Button>
      </div>
    </form>
  )
}
