import type React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowDown, ArrowRight, ArrowUp } from "lucide-react"

interface DashboardStatsProps {
  title: string
  value: string
  description: string
  trend: "up" | "down" | "neutral"
  icon?: React.ReactNode
}

export function DashboardStats({ title, value, description, trend, icon }: DashboardStatsProps) {
  return (
    <Card className="transition-all hover:shadow-md">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <div className="flex items-center space-x-1">
          <p className="text-xs text-muted-foreground">{description}</p>
          {trend === "up" && <ArrowUp className="h-3 w-3 text-emerald-500" />}
          {trend === "down" && <ArrowDown className="h-3 w-3 text-red-500" />}
          {trend === "neutral" && <ArrowRight className="h-3 w-3 text-muted-foreground" />}
        </div>
      </CardContent>
    </Card>
  )
}

