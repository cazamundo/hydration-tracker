"use client"

import { useEffect, useState } from "react"
import { BarChart3, CheckCircle, XCircle, Droplets, Waves, AlertTriangle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getStats } from "@/app/actions"

interface DayStats {
  date: string
  drinks: { glasses: number; timestamp: string }[]
  pees: { type: string; timestamp: string }[]
  totalGlasses: number
  normalPees: number
  accidents: number
}

interface Stats {
  today: DayStats
  week: DayStats[]
  month: DayStats[]
}

export function OverviewTab() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = async () => {
    try {
      const data = await getStats()
      setStats(data)
    } catch (error) {
      console.error("Failed to load stats:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">Loading stats...</div>
      </div>
    )
  }

  const isDrinkOk = (glasses: number) => glasses >= 6
  const isPeeOk = (normal: number, accidents: number) => normal >= 4 && accidents <= 1

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    })
  }

  return (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <BarChart3 className="w-12 h-12 mx-auto text-primary mb-2" />
        <h2 className="text-xl font-semibold">Overview</h2>
      </div>

      <Tabs defaultValue="today" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="today">Today</TabsTrigger>
          <TabsTrigger value="week">Week</TabsTrigger>
          <TabsTrigger value="month">Month</TabsTrigger>
        </TabsList>

        <TabsContent value="today" className="space-y-4 mt-4">
          {stats?.today && (
            <>
              {/* Summary Cards */}
              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardContent className="p-4 text-center">
                    <Droplets className="w-8 h-8 mx-auto text-primary mb-2" />
                    <div className="text-3xl font-bold">{stats.today.totalGlasses}</div>
                    <div className="text-sm text-muted-foreground">Glasses</div>
                    {isDrinkOk(stats.today.totalGlasses) ? (
                      <CheckCircle className="w-5 h-5 text-green-500 mx-auto mt-2" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-500 mx-auto mt-2" />
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4 text-center">
                    <Waves className="w-8 h-8 mx-auto text-primary mb-2" />
                    <div className="text-3xl font-bold">{stats.today.normalPees}</div>
                    <div className="text-sm text-muted-foreground">Normal</div>
                    {stats.today.accidents > 0 && (
                      <div className="flex items-center justify-center gap-1 mt-1 text-amber-500">
                        <AlertTriangle className="w-4 h-4" />
                        <span className="text-sm">{stats.today.accidents} acc.</span>
                      </div>
                    )}
                    {isPeeOk(stats.today.normalPees, stats.today.accidents) ? (
                      <CheckCircle className="w-5 h-5 text-green-500 mx-auto mt-2" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-500 mx-auto mt-2" />
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Timeline */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Today's Log</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {[
                    ...stats.today.drinks.map((d) => ({ ...d, type: "drink" as const })),
                    ...stats.today.pees.map((p) => ({ ...p, type: "pee" as const, glasses: 0 })),
                  ]
                    .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
                    .map((entry, i) => (
                      <div key={i} className="flex items-center gap-3 text-sm">
                        <span className="text-muted-foreground w-16">{formatTime(entry.timestamp)}</span>
                        {entry.type === "drink" ? (
                          <>
                            <Droplets className="w-4 h-4 text-primary" />
                            <span>
                              {entry.glasses} glass{entry.glasses > 1 ? "es" : ""}
                            </span>
                          </>
                        ) : (
                          <>
                            {(entry as any).type === "accident" ? (
                              <AlertTriangle className="w-4 h-4 text-amber-500" />
                            ) : (
                              <Waves className="w-4 h-4 text-primary" />
                            )}
                            <span>{(entry as any).type === "accident" ? "Accident" : "Normal"}</span>
                          </>
                        )}
                      </div>
                    ))}
                  {stats.today.drinks.length === 0 && stats.today.pees.length === 0 && (
                    <p className="text-muted-foreground text-center py-4">No entries yet today</p>
                  )}
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>

        <TabsContent value="week" className="space-y-4 mt-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">This Week</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {stats?.week.map((day, i) => (
                <div key={i} className="flex items-center justify-between py-2 border-b last:border-0">
                  <span className="text-sm font-medium">{formatDate(day.date)}</span>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <Droplets className="w-4 h-4 text-primary" />
                      <span className="text-sm">{day.totalGlasses}</span>
                      {isDrinkOk(day.totalGlasses) ? (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      ) : (
                        <XCircle className="w-4 h-4 text-red-500" />
                      )}
                    </div>
                    <div className="flex items-center gap-1">
                      <Waves className="w-4 h-4 text-primary" />
                      <span className="text-sm">{day.normalPees}</span>
                      {day.accidents > 0 && <span className="text-xs text-amber-500">+{day.accidents}</span>}
                      {isPeeOk(day.normalPees, day.accidents) ? (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      ) : (
                        <XCircle className="w-4 h-4 text-red-500" />
                      )}
                    </div>
                  </div>
                </div>
              ))}
              {(!stats?.week || stats.week.length === 0) && (
                <p className="text-muted-foreground text-center py-4">No data this week</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="month" className="space-y-4 mt-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Monthly Summary</CardTitle>
            </CardHeader>
            <CardContent>
              {stats?.month && stats.month.length > 0 ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-primary">
                        {Math.round(stats.month.reduce((acc, d) => acc + d.totalGlasses, 0) / stats.month.length)}
                      </div>
                      <div className="text-xs text-muted-foreground">Avg glasses/day</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-primary">
                        {Math.round(stats.month.reduce((acc, d) => acc + d.normalPees, 0) / stats.month.length)}
                      </div>
                      <div className="text-xs text-muted-foreground">Avg bathroom/day</div>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-bold text-amber-500">
                      {stats.month.reduce((acc, d) => acc + d.accidents, 0)}
                    </div>
                    <div className="text-xs text-muted-foreground">Total accidents this month</div>
                  </div>
                  <div className="text-center pt-2">
                    <div className="text-lg font-semibold">
                      {
                        stats.month.filter((d) => isDrinkOk(d.totalGlasses) && isPeeOk(d.normalPees, d.accidents))
                          .length
                      }{" "}
                      / {stats.month.length}
                    </div>
                    <div className="text-xs text-muted-foreground">Days on target</div>
                  </div>
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-4">No data this month</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
