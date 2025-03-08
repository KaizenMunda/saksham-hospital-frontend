'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { useToast } from '@/components/ui/use-toast'
import { useRole } from '@/contexts/role-context'
import { Card, CardContent } from "@/components/ui/card"
import { usePanels } from '@/hooks/usePanels'
import { PanelsTable } from '@/components/panels/PanelsTable'
import { PanelFormDialog } from '@/components/panels/PanelFormDialog'
import type { Panel } from './types'

export default function PanelsPage() {
  const { hasPermission } = useRole()
  const { toast } = useToast()
  const { panels, isLoading, mutate } = usePanels()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingPanel, setEditingPanel] = useState<Panel | undefined>()
  const [searchQuery, setSearchQuery] = useState('')

  const handleEdit = (panel: Panel) => {
    setEditingPanel(panel)
    setIsDialogOpen(true)
  }

  const handleViewFile = (url: string | null) => {
    if (url) {
      window.open(url, '_blank')
    } else {
      toast({
        title: "Error",
        description: "File not found",
        variant: "destructive",
      })
    }
  }

  const handleNewPanel = () => {
    setEditingPanel(undefined)
    setIsDialogOpen(true)
  }

  const handleDelete = async (panel: Panel) => {
    if (!confirm(`Are you sure you want to delete ${panel.name}?`)) {
      return
    }

    try {
      const response = await fetch(`/api/panels?id=${panel.id}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        throw new Error('Failed to delete panel')
      }

      toast({
        title: "Success",
        description: "Panel deleted successfully",
      })
      mutate()
    } catch (error) {
      console.error('Error deleting panel:', error)
      toast({
        title: "Error",
        description: "Failed to delete panel",
        variant: "destructive",
      })
    }
  }

  const filteredPanels = (panels || []).filter(panel => 
    panel.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    panel.panelType.toLowerCase().includes(searchQuery.toLowerCase()) ||
    panel.pocName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    panel.pocPhone?.includes(searchQuery)
  )

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Panels</h1>
        <div className="flex gap-4">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search panels..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          {hasPermission('manage_panels') && (
            <Button onClick={() => {
              setEditingPanel(undefined)
              setIsDialogOpen(true)
            }}>
              New Panel
            </Button>
          )}
        </div>
      </div>

      <Card>
        <CardContent className="pt-6">
          <PanelsTable
            panels={filteredPanels}
            onEdit={handleEdit}
            onViewContract={(panel) => handleViewFile(panel.contract_file_path)}
            onViewRateList={(panel) => handleViewFile(panel.rate_list_file_path)}
            onDelete={handleDelete}
            onNewPanel={handleNewPanel}
          />
        </CardContent>
      </Card>

      <PanelFormDialog
        panel={editingPanel}
        open={isDialogOpen}
        onOpenChange={(open) => {
          setIsDialogOpen(open)
          if (!open) setEditingPanel(undefined)
        }}
        onSuccess={async () => {
          await mutate()
        }}
      />
    </div>
  )
} 