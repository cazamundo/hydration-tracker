"use client"

import { useState } from "react"
import { Droplets, Waves, BarChart3 } from "lucide-react"
import { DrinkTab } from "@/components/drink-tab"
import { PeeTab } from "@/components/pee-tab"
import { OverviewTab } from "@/components/overview-tab"

type Tab = "overview" | "drink" | "pee"

export default function Home() {
  const [activeTab, setActiveTab] = useState<Tab>("drink")

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="bg-primary text-primary-foreground p-4 text-center">
        <h1 className="text-2xl font-bold tracking-tight">IN & OUT</h1>
        <p className="text-sm opacity-80">Track your hydration</p>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-4 pb-24">
        {activeTab === "overview" && <OverviewTab />}
        {activeTab === "drink" && <DrinkTab />}
        {activeTab === "pee" && <PeeTab />}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border">
        <div className="flex justify-around items-center h-16 max-w-md mx-auto">
          <button
            onClick={() => setActiveTab("overview")}
            className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
              activeTab === "overview" ? "text-primary" : "text-muted-foreground"
            }`}
          >
            <BarChart3 className="w-6 h-6" />
            <span className="text-xs mt-1">Overview</span>
          </button>
          <button
            onClick={() => setActiveTab("drink")}
            className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
              activeTab === "drink" ? "text-primary" : "text-muted-foreground"
            }`}
          >
            <Droplets className="w-6 h-6" />
            <span className="text-xs mt-1">Drink</span>
          </button>
          <button
            onClick={() => setActiveTab("pee")}
            className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
              activeTab === "pee" ? "text-primary" : "text-muted-foreground"
            }`}
          >
            <Waves className="w-6 h-6" />
            <span className="text-xs mt-1">Pee</span>
          </button>
        </div>
      </nav>
    </div>
  )
}
