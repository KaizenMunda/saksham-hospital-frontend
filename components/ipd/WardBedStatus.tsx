'use client'

import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

interface WardStat {
  ward: string
  total: number
  available: number
  occupied: number
  maintenance: number
}

interface WardBedStatusProps {
  stats: WardStat[]
  totalBeds: number
  availableBeds: number
  occupiedBeds: number
  isLoading?: boolean
}

export function WardBedStatus({ 
  stats, 
  totalBeds, 
  availableBeds, 
  occupiedBeds,
  isLoading = false 
}: WardBedStatusProps) {
  // Calculate overall occupancy rate safely
  const overallOccupancyRate = totalBeds > 0 
    ? Math.round((occupiedBeds / totalBeds) * 100) 
    : 0;
  
  // Ensure we have a valid number for display
  const displayOverallRate = isNaN(overallOccupancyRate) ? 0 : overallOccupancyRate;
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Overall Hospital Bed Occupancy Card */}
      <Card className="overflow-hidden md:col-span-3 bg-muted/20">
        <CardContent className="p-4">
          <h3 className="text-sm font-medium mb-2">Overall Hospital Occupancy</h3>
          
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs text-muted-foreground">Occupancy Rate</span>
            <span className="text-xs font-medium">{isLoading ? '-' : displayOverallRate}%</span>
          </div>
          
          <Progress 
            value={displayOverallRate} 
            className={`h-2 mb-3 ${
              displayOverallRate > 90 ? "bg-destructive" : 
              displayOverallRate > 75 ? "bg-warning" : 
              "bg-primary"
            }`}
          />
          
          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            <div>
              <div className="font-medium">{isLoading ? '-' : totalBeds}</div>
              <div className="text-muted-foreground">Total Beds</div>
            </div>
            <div>
              <div className="font-medium text-primary">{isLoading ? '-' : availableBeds}</div>
              <div className="text-muted-foreground">Available</div>
            </div>
            <div>
              <div className="font-medium text-destructive">{isLoading ? '-' : occupiedBeds}</div>
              <div className="text-muted-foreground">Occupied</div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Individual Ward Cards */}
      {stats.map((ward) => {
        // Calculate ward occupancy rate safely
        const occupancyRate = ward.total > 0 
          ? Math.round((ward.occupied / ward.total) * 100) 
          : 0;
        
        // Ensure we have a valid number for display
        const displayRate = isNaN(occupancyRate) ? 0 : occupancyRate;
        
        return (
          <Card key={ward.ward} className="overflow-hidden">
            <CardContent className="p-4">
              <h3 className="text-sm font-medium mb-2">{ward.ward}</h3>
              
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs text-muted-foreground">Occupancy</span>
                <span className="text-xs font-medium">{displayRate}%</span>
              </div>
              
              <Progress 
                value={displayRate} 
                className={`h-2 mb-3 ${
                  displayRate > 90 ? "bg-destructive" : 
                  displayRate > 75 ? "bg-warning" : 
                  "bg-primary"
                }`}
              />
              
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div>
                  <div className="font-medium">{ward.total}</div>
                  <div className="text-muted-foreground">Total</div>
                </div>
                <div>
                  <div className="font-medium text-primary">{ward.available}</div>
                  <div className="text-muted-foreground">Available</div>
                </div>
                <div>
                  <div className="font-medium text-destructive">{ward.occupied}</div>
                  <div className="text-muted-foreground">Occupied</div>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
} 