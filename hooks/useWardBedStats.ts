'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

interface WardStat {
  ward: string
  total: number
  available: number
  occupied: number
  maintenance: number
}

export function useWardBedStats() {
  const [stats, setStats] = useState<WardStat[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setIsLoading(true)
        
        // First, get all beds
        const { data: beds, error: bedsError } = await supabase
          .from('beds')
          .select('*')
        
        if (bedsError) throw bedsError
        
        // Get all current admissions to check which beds are occupied
        const { data: admissions, error: admissionsError } = await supabase
          .from('ipd_admissions')
          .select('bed_id')
          .eq('status', 'Admitted')
        
        if (admissionsError) throw admissionsError
        
        // Create a set of occupied bed IDs for faster lookup
        const occupiedBedIds = new Set(admissions.map(a => a.bed_id))
        
        // Group beds by ward and calculate stats
        const wardStats: Record<string, WardStat> = {}
        
        beds.forEach(bed => {
          if (!wardStats[bed.ward]) {
            wardStats[bed.ward] = {
              ward: bed.ward,
              total: 0,
              available: 0,
              occupied: 0,
              maintenance: 0
            }
          }
          
          wardStats[bed.ward].total++
          
          // Check if bed is occupied by looking it up in the occupiedBedIds set
          if (occupiedBedIds.has(bed.id)) {
            wardStats[bed.ward].occupied++
          } else if (bed.status === 'Maintenance') {
            wardStats[bed.ward].maintenance++
          } else {
            wardStats[bed.ward].available++
          }
        })
        
        // Convert to array and sort by ward name
        const statsArray = Object.values(wardStats).sort((a, b) => 
          a.ward.localeCompare(b.ward)
        )
        
        setStats(statsArray)
        console.log('Ward stats:', statsArray)
      } catch (err) {
        console.error('Error fetching ward stats:', err)
        setError(err instanceof Error ? err : new Error('Unknown error'))
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchStats()
    
    // Set up real-time subscription for beds table
    const bedsSubscription = supabase
      .channel('beds-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'beds' }, fetchStats)
      .subscribe()
    
    // Set up real-time subscription for admissions table
    const admissionsSubscription = supabase
      .channel('admissions-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'ipd_admissions' }, fetchStats)
      .subscribe()
    
    return () => {
      bedsSubscription.unsubscribe()
      admissionsSubscription.unsubscribe()
    }
  }, [])
  
  return { stats, isLoading, error }
} 