"use server"

import { Redis } from "@upstash/redis"

const redis = new Redis({
  url: process.env.KV_REST_API_URL!,
  token: process.env.KV_REST_API_TOKEN!,
})

function getDateKey(date: Date = new Date()) {
  return date.toISOString().split("T")[0]
}

function getDatesInRange(days: number): string[] {
  const dates: string[] = []
  for (let i = 0; i < days; i++) {
    const date = new Date()
    date.setDate(date.getDate() - i)
    dates.push(getDateKey(date))
  }
  return dates
}

export async function logDrink(glasses: number) {
  const dateKey = getDateKey()
  const entry = {
    glasses,
    timestamp: new Date().toISOString(),
  }

  const key = `drinks:${dateKey}`
  const existing = (await redis.get<any[]>(key)) || []
  existing.push(entry)
  await redis.set(key, existing)

  return { success: true }
}

export async function logPee(type: "normal" | "accident") {
  const dateKey = getDateKey()
  const entry = {
    type,
    timestamp: new Date().toISOString(),
  }

  const key = `pees:${dateKey}`
  const existing = (await redis.get<any[]>(key)) || []
  existing.push(entry)
  await redis.set(key, existing)

  return { success: true }
}

async function getDayStats(dateKey: string) {
  const drinks = (await redis.get<any[]>(`drinks:${dateKey}`)) || []
  const pees = (await redis.get<any[]>(`pees:${dateKey}`)) || []

  return {
    date: dateKey,
    drinks,
    pees,
    totalGlasses: drinks.reduce((acc, d) => acc + d.glasses, 0),
    normalPees: pees.filter((p) => p.type === "normal").length,
    accidents: pees.filter((p) => p.type === "accident").length,
  }
}

export async function getStats() {
  const today = await getDayStats(getDateKey())

  const weekDates = getDatesInRange(7)
  const week = await Promise.all(weekDates.map(getDayStats))

  const monthDates = getDatesInRange(30)
  const month = await Promise.all(monthDates.map(getDayStats))

  return {
    today,
    week: week.filter((d) => d.drinks.length > 0 || d.pees.length > 0),
    month: month.filter((d) => d.drinks.length > 0 || d.pees.length > 0),
  }
}
