import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

interface BedStatsProps {
  total: number
  available: number
  occupied: number
  isLoading?: boolean
}

export function BedStats({ total, available, occupied, isLoading = false }: BedStatsProps) {
  const occupancyRate = total > 0 ? Math.round((occupied / total) * 100) : 0
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">Bed Occupancy</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{occupancyRate}%</div>
        <Progress 
          value={occupancyRate} 
          className="h-2 mt-2" 
          indicatorColor={
            occupancyRate > 90 ? "bg-destructive" : 
            occupancyRate > 75 ? "bg-warning" : 
            "bg-primary"
          }
        />
        <div className="grid grid-cols-3 gap-4 mt-4">
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground">Total</span>
            <span className="font-medium">{isLoading ? '-' : total}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground">Available</span>
            <span className="font-medium text-primary">{isLoading ? '-' : available}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground">Occupied</span>
            <span className="font-medium text-destructive">{isLoading ? '-' : occupied}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 