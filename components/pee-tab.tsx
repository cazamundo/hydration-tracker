"use client"

import { useState } from "react"
import { Waves, Check, AlertTriangle } from "lucide-react"
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

  return (
    <div className="space-y-6">
      <div className="text-center">
        <Waves className="w-16 h-16 mx-auto text-primary mb-4" />
        <h2 className="text-xl font-semibold">Log Bathroom Visit</h2>
        <p className="text-muted-foreground">What type of visit?</p>
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
              <span className="text-2xl font-semibold">Normal</span>
              <p className="text-muted-foreground text-sm">Scheduled bathroom visit</p>
            </div>
            {loading === "normal" && <span className="text-sm text-muted-foreground">Saving...</span>}
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
              <span className="text-2xl font-semibold">Accident</span>
              <p className="text-muted-foreground text-sm">Unplanned / urgency</p>
            </div>
            {loading === "accident" && <span className="text-sm text-muted-foreground">Saving...</span>}
          </CardContent>
        </Card>
      </div>

      <div className="text-center text-sm text-muted-foreground">
        <p>Goal: 5 bathroom visits per day</p>
        <p>Every 3-4 hours is ideal</p>
      </div>
    </div>
  )
}
