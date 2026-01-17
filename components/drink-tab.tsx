"use client"

import { useState } from "react"
import { Droplets, Check, Clock } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { logDrink } from "@/app/actions"

export function DrinkTab() {
  const [loading, setLoading] = useState<number | null>(null)
  const [success, setSuccess] = useState<number | null>(null)

  const handleDrink = async (glasses: number) => {
    setLoading(glasses)
    setSuccess(null)
    try {
      await logDrink(glasses)
      setSuccess(glasses)
      setTimeout(() => setSuccess(null), 2000)
    } catch (error) {
      console.error("Failed to log drink:", error)
    } finally {
      setLoading(null)
    }
  }

  const drinkSchedule = [
    { time: "8u", label: "Bij ontbijt" },
    { time: "12u", label: "Bij middageten" },
    { time: "16u", label: "Late namiddag" },
    { time: "20u", label: "Bij avondeten" },
  ]

  return (
    <div className="flex flex-col min-h-[calc(100vh-200px)]">
      <div className="space-y-6">
        <div className="text-center">
          <Droplets className="w-16 h-16 mx-auto text-primary mb-4" />
          <h2 className="text-xl font-semibold">Drinken registreren</h2>
          <p className="text-muted-foreground">Hoeveel heb je gedronken?</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Card
            className={`cursor-pointer transition-all hover:border-primary ${
              success === 1 ? "border-green-500 bg-green-50 dark:bg-green-950" : ""
            }`}
            onClick={() => !loading && handleDrink(1)}
          >
            <CardContent className="flex flex-col items-center justify-center p-8">
              {success === 1 ? (
                <Check className="w-12 h-12 text-green-500 mb-2" />
              ) : (
                <span className="text-5xl font-bold text-primary mb-2">1</span>
              )}
              <span className="text-muted-foreground">Glas</span>
              {loading === 1 && <span className="text-sm text-muted-foreground mt-2">Opslaan...</span>}
            </CardContent>
          </Card>

          <Card
            className={`cursor-pointer transition-all hover:border-primary ${
              success === 2 ? "border-green-500 bg-green-50 dark:bg-green-950" : ""
            }`}
            onClick={() => !loading && handleDrink(2)}
          >
            <CardContent className="flex flex-col items-center justify-center p-8">
              {success === 2 ? (
                <Check className="w-12 h-12 text-green-500 mb-2" />
              ) : (
                <span className="text-5xl font-bold text-primary mb-2">2</span>
              )}
              <span className="text-muted-foreground">Glazen</span>
              {loading === 2 && <span className="text-sm text-muted-foreground mt-2">Opslaan...</span>}
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="mt-auto pt-8">
        <div className="border-t pt-6">
          <div className="flex items-center gap-2 text-muted-foreground mb-4">
            <Clock className="w-4 h-4" />
            <span className="text-sm font-medium">Aanbevolen drinkschema</span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {drinkSchedule.map((item) => (
              <div key={item.time} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                <span className="text-sm font-semibold text-primary min-w-[3ch]">{item.time}</span>
                <span className="text-sm text-muted-foreground">{item.label}</span>
              </div>
            ))}
          </div>

          <p className="text-xs text-muted-foreground mt-4 text-center">Doel: 400-500ml (2 glazen) per drinkmoment</p>
        </div>
      </div>
    </div>
  )
}
