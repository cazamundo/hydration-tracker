"use client"

import { useState, useEffect } from "react"
import { X, Trash2, Droplets, Waves, AlertTriangle, ArrowLeft } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { getTodayEntries, deleteDrinkEntry, deletePeeEntry } from "@/app/actions"

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

export function ManageEntries({ onClose }: ManageEntriesProps) {
  const [entries, setEntries] = useState<DayStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState<string | null>(null)

  useEffect(() => {
    loadEntries()
  }, [])

  const loadEntries = async () => {
    setLoading(true)
    try {
      const data = await getTodayEntries()
      setEntries(data)
    } catch (error) {
      console.error("Failed to load entries:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteDrink = async (timestamp: string) => {
    if (!entries) return
    setDeleting(timestamp)
    try {
      await deleteDrinkEntry(entries.date, timestamp)
      await loadEntries()
    } catch (error) {
      console.error("Failed to delete drink entry:", error)
    } finally {
      setDeleting(null)
    }
  }

  const handleDeletePee = async (timestamp: string) => {
    if (!entries) return
    setDeleting(timestamp)
    try {
      await deletePeeEntry(entries.date, timestamp)
      await loadEntries()
    } catch (error) {
      console.error("Failed to delete pee entry:", error)
    } finally {
      setDeleting(null)
    }
  }

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString("nl-NL", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const allEntries = entries
    ? [
        ...entries.drinks.map((d) => ({ ...d, entryType: "drink" as const })),
        ...entries.pees.map((p) => ({ ...p, entryType: "pee" as const, glasses: 0 })),
      ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    : []

  return (
    <div className="fixed inset-0 bg-background z-50 flex flex-col">
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
        ) : allEntries.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-muted-foreground">Geen registraties vandaag</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground mb-4">
              Vandaag: {entries?.totalGlasses} glazen, {entries?.normalPees} plasbeurten
              {entries?.accidents ? `, ${entries.accidents} ongelukjes` : ""}
            </p>

            {allEntries.map((entry) => (
              <Card key={entry.timestamp} className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="flex items-center">
                    <div className="flex items-center gap-3 flex-1 p-4">
                      <span className="text-sm text-muted-foreground w-14">
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
                        entry.entryType === "drink"
                          ? handleDeleteDrink(entry.timestamp)
                          : handleDeletePee(entry.timestamp)
                      }
                      disabled={deleting === entry.timestamp}
                      className="p-4 text-destructive hover:bg-destructive/10 transition-colors disabled:opacity-50 border-l border-border"
                      aria-label="Verwijderen"
                    >
                      {deleting === entry.timestamp ? (
                        <div className="w-5 h-5 border-2 border-destructive border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Trash2 className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
