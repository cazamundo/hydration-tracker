"use client"

import { useState, useEffect } from "react"
import { Droplets, Waves, BarChart3, Wifi, WifiOff } from "lucide-react"
import { DrinkTab } from "@/components/drink-tab"
import { PeeTab } from "@/components/pee-tab"
import { OverviewTab } from "@/components/overview-tab"
import { checkConnection } from "./actions"

type Tab = "overview" | "drink" | "pee"

export default function Home() {
  const [activeTab, setActiveTab] = useState<Tab>("drink")
  const [connectionStatus, setConnectionStatus] = useState<{
    checked: boolean
    connected: boolean
    error?: string
  }>({ checked: false, connected: false })

  useEffect(() => {
    checkConnection().then((result) => {
      setConnectionStatus({
        checked: true,
        connected: result.connected,
        error: result.error,
      })
    })
  }, [])

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="bg-primary text-primary-foreground p-4 text-center relative">
        <h1 className="text-2xl font-bold tracking-tight">IN & OUT</h1>
        <p className="text-sm opacity-80">Track your hydration</p>

        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          {!connectionStatus.checked ? (
            <div className="w-5 h-5 rounded-full bg-primary-foreground/30 animate-pulse" />
          ) : connectionStatus.connected ? (
            <div className="flex items-center gap-1 text-green-300" title="Connected to database">
              <Wifi className="w-5 h-5" />
            </div>
          ) : (
            <div
              className="flex items-center gap-1 text-red-300 cursor-pointer"
              title={connectionStatus.error || "Not connected"}
              onClick={() => alert(connectionStatus.error || "Database not connected")}
            >
              <WifiOff className="w-5 h-5" />
            </div>
          )}
        </div>
      </header>

      {connectionStatus.checked && !connectionStatus.connected && (
        <div className="bg-destructive/10 border-b border-destructive/20 px-4 py-3 text-center">
          <p className="text-sm text-destructive font-medium">Database not connected</p>
          <p className="text-xs text-destructive/80 mt-1">{connectionStatus.error}</p>
        </div>
      )}

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
