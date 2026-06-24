import type { Habit } from "../types/habit"

const API_BASE = "/api/habits"

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: "Request failed" }))
    throw new Error(error.message || "Request failed")
  }

  if (response.status === 204) {
    return undefined as T
  }

  return response.json()
}

export async function fetchHabits(): Promise<Habit[]> {
  const response = await fetch(API_BASE)
  return handleResponse<Habit[]>(response)
}

export async function createHabit(name: string): Promise<Habit> {
  const response = await fetch(API_BASE, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name }),
  })
  return handleResponse<Habit>(response)
}

export async function deleteHabit(id: string): Promise<void> {
  const response = await fetch(`${API_BASE}/${id}`, { method: "DELETE" })
  await handleResponse<void>(response)
}

export async function toggleHabitCompletion(id: string, date: Date): Promise<Habit> {
  const response = await fetch(`${API_BASE}/${id}/toggle`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ date: date.toISOString() }),
  })
  return handleResponse<Habit>(response)
}
