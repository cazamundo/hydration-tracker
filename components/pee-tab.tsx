"use client"

import { useState } from "react"
import { Waves, Check, AlertTriangle, Clock } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { logPee } from "@/app/actions"

export function PeeTab() {
  const [loading, setLoading] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const handlePee = async (type: "normal" | "accident") => {
    setLoading(type)
    setSuccess(null)
    try {
      await logPee(type)
      setSuccess(type)
      setTimeout(() => setSuccess(null), 2000)
    } catch (error) {
      console.error("Failed to log pee:", error)
    } finally {
      setLoading(null)
    }
  }

  const peeSchedule = [
    { time: "8u", label: "Bij opstaan" },
    { time: "12u", label: "Rond de middag" },
    { time: "16u", label: "Late namiddag" },
    { time: "20u", label: "Rond avondeten" },
    { time: "23u", label: "Voor slapengaan" },
  ]

  return (
    <div className="flex flex-col min-h-[calc(100vh-200px)]">
      <div className="space-y-6">
        <div className="text-center">
          <Waves className="w-16 h-16 mx-auto text-primary mb-4" />
          <h2 className="text-xl font-semibold">Plassen registreren</h2>
          <p className="text-muted-foreground">Welk type plasbeurt?</p>
        </div>

        <div className="grid grid-cols-1 gap-4">
          <Card
            className={`cursor-pointer transition-all hover:border-primary ${
              success === "normal" ? "border-green-500 bg-green-50 dark:bg-green-950" : ""
            }`}
            onClick={() => !loading && handlePee("normal")}
          >
            <CardContent className="flex items-center justify-center gap-4 p-8">
              {success === "normal" ? (
                <Check className="w-10 h-10 text-green-500" />
              ) : (
                <Check className="w-10 h-10 text-primary" />
              )}
              <div>
                <span className="text-2xl font-semibold">Normaal</span>
                <p className="text-muted-foreground text-sm">Geplande plasbeurt</p>
              </div>
              {loading === "normal" && <span className="text-sm text-muted-foreground">Opslaan...</span>}
            </CardContent>
          </Card>

          <Card
            className={`cursor-pointer transition-all hover:border-amber-500 border-amber-200 ${
              success === "accident" ? "border-green-500 bg-green-50 dark:bg-green-950" : ""
            }`}
            onClick={() => !loading && handlePee("accident")}
          >
            <CardContent className="flex items-center justify-center gap-4 p-8">
              {success === "accident" ? (
                <Check className="w-10 h-10 text-green-500" />
              ) : (
                <AlertTriangle className="w-10 h-10 text-amber-500" />
              )}
              <div>
                <span className="text-2xl font-semibold">Ongelukje</span>
                <p className="text-muted-foreground text-sm">Ongepland / drang</p>
              </div>
              {loading === "accident" && <span className="text-sm text-muted-foreground">Opslaan...</span>}
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="mt-auto pt-8">
        <div className="border-t pt-6">
          <div className="flex items-center gap-2 text-muted-foreground mb-4">
            <Clock className="w-4 h-4" />
            <span className="text-sm font-medium">Aanbevolen plasschema</span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {peeSchedule.map((item) => (
              <div key={item.time} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                <span className="text-sm font-semibold text-primary min-w-[3ch]">{item.time}</span>
                <span className="text-sm text-muted-foreground">{item.label}</span>
              </div>
            ))}
          </div>

          <p className="text-xs text-muted-foreground mt-4 text-center">
            Doel: elke 3-4 uur plassen, blaas langzaam trainen
          </p>
        </div>
      </div>
    </div>
  )
}
