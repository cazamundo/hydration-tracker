"use client"

import { useState } from "react"
import { Droplets, Check } from "lucide-react"
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

  return (
    <div className="space-y-6">
      <div className="text-center">
        <Droplets className="w-16 h-16 mx-auto text-primary mb-4" />
        <h2 className="text-xl font-semibold">Log Water Intake</h2>
        <p className="text-muted-foreground">How much did you drink?</p>
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
            <span className="text-muted-foreground">Glass</span>
            {loading === 1 && <span className="text-sm text-muted-foreground mt-2">Saving...</span>}
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
            <span className="text-muted-foreground">Glasses</span>
            {loading === 2 && <span className="text-sm text-muted-foreground mt-2">Saving...</span>}
          </CardContent>
        </Card>
      </div>

      <div className="text-center text-sm text-muted-foreground">
        <p>Goal: 4 drink moments per day</p>
        <p>~400-500ml (2 glasses) per moment</p>
      </div>
    </div>
  )
}
