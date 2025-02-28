'use client'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, FileText, ImageIcon } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { format, parseISO } from "date-fns"
import type { Panel } from "@/app/panels/types"
import { toast } from "@/components/ui/use-toast"

interface PanelsTableProps {
  panels: Panel[]
  onEdit: (panel: Panel) => void
  onViewContract: (panel: Panel) => void
  onViewRateList: (panel: Panel) => void
  onDelete: (panel: Panel) => void
  onNewPanel: () => void
}

export function PanelsTable({ panels, onEdit, onViewContract, onViewRateList, onDelete, onNewPanel }: PanelsTableProps) {
  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-'
    try {
      return format(parseISO(dateString), 'dd/MM/yyyy')
    } catch (error) {
      console.error('Error formatting date:', dateString, error)
      return dateString
    }
  }

  const handleViewFile = async (url: string | null) => {
    if (!url) return

    try {
      // Extract the file path from the URL
      const path = url.split('/panel-documents/')[1]
      if (!path) {
        throw new Error('Invalid file URL')
      }

      console.log('Viewing file:', { url, path })

      const response = await fetch(`/api/panels/view?path=${encodeURIComponent(path)}`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to get file URL')
      }

      // Open the file in a new tab
      window.open(data.url, '_blank')
    } catch (error: any) {
      console.error('Error viewing file:', error)
      toast({
        title: "Error",
        description: error.message || "Failed to view file",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={onNewPanel}>
          New Panel
        </Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Logo</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Start Date</TableHead>
            <TableHead>Expiry Date</TableHead>
            <TableHead>POC Name</TableHead>
            <TableHead>POC Phone</TableHead>
            <TableHead>POC Email</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {panels.map((panel) => (
            <TableRow key={panel.id}>
              <TableCell>
                {panel.logo_url ? (
                  <img 
                    src={panel.logo_url} 
                    alt={`${panel.name} logo`}
                    className="w-10 h-10 object-contain"
                  />
                ) : (
                  <div className="w-10 h-10 bg-muted rounded flex items-center justify-center">
                    <ImageIcon className="w-6 h-6 text-muted-foreground" />
                  </div>
                )}
              </TableCell>
              <TableCell className="font-medium">{panel.name}</TableCell>
              <TableCell>{panel.panel_type}</TableCell>
              <TableCell>{formatDate(panel.start_date)}</TableCell>
              <TableCell>{formatDate(panel.expiry_date)}</TableCell>
              <TableCell>{panel.poc_name || '-'}</TableCell>
              <TableCell>{panel.poc_phone || '-'}</TableCell>
              <TableCell>{panel.poc_email || '-'}</TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onEdit(panel)}>
                      Edit
                    </DropdownMenuItem>
                    {panel.contract_file_path && (
                      <DropdownMenuItem onClick={() => handleViewFile(panel.contract_file_path)}>
                        <FileText className="mr-2 h-4 w-4" />
                        View Contract
                      </DropdownMenuItem>
                    )}
                    {panel.rate_list_file_path && (
                      <DropdownMenuItem onClick={() => handleViewFile(panel.rate_list_file_path)}>
                        <FileText className="mr-2 h-4 w-4" />
                        View Rate List
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem
                      onClick={() => onDelete(panel)}
                      className="text-destructive"
                    >
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
} 