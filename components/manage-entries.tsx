"use client"

import { useState, useEffect } from "react"
import { Trash2, Droplets, Waves, AlertTriangle, ArrowLeft, Calendar } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  getAllEntries,
  deleteDrinkEntry,
  deletePeeEntry,
  deleteDay,
} from "@/app/actions"

interface DayStats {
  date: string
  drinks: { glasses: number; timestamp: string }[]
  pees: { type: string; timestamp: string }[]
  totalGlasses: number
  normalPees: number
  accidents: number
}

interface ManageEntriesProps {
  onClose: () => void
}

interface ConfirmDialogProps {
  title: string
  message: string
  onConfirm: () => void
  onCancel: () => void
  isLoading?: boolean
}

function ConfirmDialog({ title, message, onConfirm, onCancel, isLoading }: ConfirmDialogProps) {
  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
      <Card className="w-full max-w-sm">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-2">{title}</h3>
          <p className="text-muted-foreground mb-6">{message}</p>
          <div className="flex gap-3">
            <Button
              variant="outline"
              className="flex-1 bg-transparent"
              onClick={onCancel}
              disabled={isLoading}
            >
              Annuleren
            </Button>
            <Button
              variant="destructive"
              className="flex-1"
              onClick={onConfirm}
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-destructive-foreground border-t-transparent rounded-full animate-spin" />
              ) : (
                "Verwijderen"
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export function ManageEntries({ onClose }: ManageEntriesProps) {
  const [entries, setEntries] = useState<DayStats[]>([])
  const [loading, setLoading] = useState(true)
  const [confirmDelete, setConfirmDelete] = useState<{
    type: "entry" | "day"
    dateKey: string
    timestamp?: string
    entryType?: "drink" | "pee"
    description: string
  } | null>(null)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    loadEntries()
  }, [])

  const loadEntries = async () => {
    setLoading(true)
    try {
      const data = await getAllEntries()
      setEntries(data)
    } catch (error) {
      console.error("Failed to load entries:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleConfirmDelete = async () => {
    if (!confirmDelete) return

    setDeleting(true)
    try {
      if (confirmDelete.type === "day") {
        await deleteDay(confirmDelete.dateKey)
      } else if (confirmDelete.entryType === "drink" && confirmDelete.timestamp) {
        await deleteDrinkEntry(confirmDelete.dateKey, confirmDelete.timestamp)
      } else if (confirmDelete.entryType === "pee" && confirmDelete.timestamp) {
        await deletePeeEntry(confirmDelete.dateKey, confirmDelete.timestamp)
      }
      await loadEntries()
    } catch (error) {
      console.error("Failed to delete:", error)
    } finally {
      setDeleting(false)
      setConfirmDelete(null)
    }
  }

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString("nl-NL", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const formatDate = (dateKey: string) => {
    const date = new Date(dateKey)
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    if (dateKey === today.toISOString().split("T")[0]) {
      return "Vandaag"
    } else if (dateKey === yesterday.toISOString().split("T")[0]) {
      return "Gisteren"
    } else {
      return date.toLocaleDateString("nl-NL", {
        weekday: "long",
        day: "numeric",
        month: "long",
      })
    }
  }

  return (
    <div className="fixed inset-0 bg-background z-50 flex flex-col">
      {/* Confirm Dialog */}
      {confirmDelete && (
        <ConfirmDialog
          title="Verwijderen bevestigen"
          message={confirmDelete.description}
          onConfirm={handleConfirmDelete}
          onCancel={() => setConfirmDelete(null)}
          isLoading={deleting}
        />
      )}

      {/* Header */}
      <header className="bg-card border-b border-border p-4 flex items-center gap-3">
        <button
          onClick={onClose}
          className="p-2 -ml-2 hover:bg-muted rounded-lg transition-colors"
          aria-label="Terug"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h2 className="text-lg font-semibold">Registraties beheren</h2>
          <p className="text-sm text-muted-foreground">Verwijder foutieve invoer</p>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 overflow-auto p-4">
        {loading ? (
          <div className="flex items-center justify-center h-32">
            <span className="text-muted-foreground">Laden...</span>
          </div>
        ) : entries.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-muted-foreground">Geen registraties gevonden</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {entries.map((day) => {
              const allDayEntries = [
                ...day.drinks.map((d) => ({ ...d, entryType: "drink" as const })),
                ...day.pees.map((p) => ({ ...p, entryType: "pee" as const, glasses: 0 })),
              ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())

              return (
                <div key={day.date}>
                  {/* Day Header */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <h3 className="font-medium">{formatDate(day.date)}</h3>
                      <span className="text-sm text-muted-foreground">
                        ({day.totalGlasses} glazen, {day.normalPees + day.accidents} plasbeurten)
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      onClick={() =>
                        setConfirmDelete({
                          type: "day",
                          dateKey: day.date,
                          description: `Weet je zeker dat je alle registraties van ${formatDate(day.date).toLowerCase()} wilt verwijderen? Dit omvat ${day.totalGlasses} glazen en ${day.normalPees + day.accidents} plasbeurten.`,
                        })
                      }
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      Hele dag
                    </Button>
                  </div>

                  {/* Day Entries */}
                  <div className="space-y-2">
                    {allDayEntries.map((entry) => (
                      <Card key={entry.timestamp} className="overflow-hidden">
                        <CardContent className="p-0">
                          <div className="flex items-center">
                            <div className="flex items-center gap-3 flex-1 p-3">
                              <span className="text-sm text-muted-foreground w-12">
                                {formatTime(entry.timestamp)}
                              </span>
                              {entry.entryType === "drink" ? (
                                <>
                                  <Droplets className="w-5 h-5 text-primary" />
                                  <span>
                                    {entry.glasses} glas{entry.glasses > 1 ? "zen" : ""}
                                  </span>
                                </>
                              ) : (
                                <>
                                  {(entry as any).type === "accident" ? (
                                    <AlertTriangle className="w-5 h-5 text-amber-500" />
                                  ) : (
                                    <Waves className="w-5 h-5 text-primary" />
                                  )}
                                  <span>
                                    {(entry as any).type === "accident" ? "Ongelukje" : "Normaal"}
                                  </span>
                                </>
                              )}
                            </div>
                            <button
                              onClick={() =>
                                setConfirmDelete({
                                  type: "entry",
                                  dateKey: day.date,
                                  timestamp: entry.timestamp,
                                  entryType: entry.entryType,
                                  description:
                                    entry.entryType === "drink"
                                      ? `Weet je zeker dat je de registratie van ${entry.glasses} glas${entry.glasses > 1 ? "zen" : ""} om ${formatTime(entry.timestamp)} wilt verwijderen?`
                                      : `Weet je zeker dat je de ${(entry as any).type === "accident" ? "ongelukje" : "plasbeurt"} registratie om ${formatTime(entry.timestamp)} wilt verwijderen?`,
                                })
                              }
                              className="p-3 text-destructive hover:bg-destructive/10 transition-colors border-l border-border"
                              aria-label="Verwijderen"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </main>
    </div>
  )
}
