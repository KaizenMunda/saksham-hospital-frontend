'use client'

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import type { Panel, NewPanel } from "@/app/panels/types"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { PANEL_TYPES, type PanelType } from "@/app/panels/types"
import { usePanelTypes } from '@/hooks/usePanelTypes'

interface PanelFormDialogProps {
  panel?: Panel
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export function PanelFormDialog({ panel, open, onOpenChange, onSuccess }: PanelFormDialogProps) {
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState<Partial<NewPanel>>(getInitialData(panel))
  const { panelTypes = [], isLoading: isLoadingTypes } = usePanelTypes()
  const [tempFiles, setTempFiles] = useState<{
    contract?: File
    rateList?: File
    logo?: File
  }>({})

  function getInitialData(panel: Panel | undefined) {
    if (!panel) {
      return {
        name: '',
        panelType: '',
        startDate: '',
        expiryDate: '',
        claimsEmail: '',
        claimsAddress: '',
        pocName: '',
        pocPhone: '',
        pocEmail: '',
        portalName: '',
        portalCredentials: {
          portalLink: '',
          username: '',
          password: ''
        }
      }
    }
    return {
      name: panel.name,
      panelType: panel.panel_type,
      startDate: panel.start_date,
      expiryDate: panel.expiry_date || '',
      claimsEmail: panel.claims_email || '',
      claimsAddress: panel.claims_address || '',
      pocName: panel.poc_name || '',
      pocPhone: panel.poc_phone || '',
      pocEmail: panel.poc_email || '',
      portalName: panel.portal_name || '',
      portalCredentials: panel.portal_credentials ? {
        portalLink: panel.portal_credentials.portal_link || '',
        username: panel.portal_credentials.username || '',
        password: panel.portal_credentials.password || ''
      } : {
        portalLink: '',
        username: '',
        password: ''
      }
    }
  }

  useEffect(() => {
    setFormData(getInitialData(panel))
  }, [panel])

  useEffect(() => {
    if (!open) {
      setTempFiles({})
    }
  }, [open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log('[Form] Submit started')

    // Validate dates
    if (formData.expiryDate && formData.startDate && formData.expiryDate < formData.startDate) {
      toast({
        title: "Error",
        description: "Expiry date must be after start date",
        variant: "destructive",
      })
      return
    }

    // Validate phone number
    if (formData.pocPhone && !/^\d{10}$/.test(formData.pocPhone)) {
      toast({
        title: "Error",
        description: "Phone number must be 10 digits",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      // Transform form data to match database column names
      const transformedData = {
        name: !panel ? formData.name : undefined, // Only include name for new panels
        panel_type: formData.panelType,
        start_date: formData.startDate,
        expiry_date: formData.expiryDate || null,
        poc_name: formData.pocName || null,
        poc_phone: formData.pocPhone || null,
        poc_email: formData.pocEmail || null,
        claims_email: formData.claimsEmail || null,
        claims_address: formData.claimsAddress || null,
        portal_name: formData.portalName || null,
        portal_credentials: formData.portalCredentials && (
          formData.portalCredentials.portalLink ||
          formData.portalCredentials.username ||
          formData.portalCredentials.password
        ) ? {
          portal_link: formData.portalCredentials.portalLink || null,
          username: formData.portalCredentials.username || null,
          password: formData.portalCredentials.password || null
        } : null
      }

      // Remove undefined values
      Object.keys(transformedData).forEach(key => {
        if (transformedData[key] === undefined) {
          delete transformedData[key]
        }
      })

      console.log('[Form] Panel ID:', panel?.id)
      console.log('[Form] Transformed data:', JSON.stringify(transformedData, null, 2))

      const url = panel ? `/api/panels?id=${panel.id}` : '/api/panels'
      console.log('[Form] Making request to:', url)

      const response = await fetch(url, {
        method: panel ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(transformedData)
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to save panel')
      }

      const responseData = await response.json()
      console.log('[Form] Server response:', responseData)

      const panelId = panel?.id || responseData.id

      // Only upload files if they were actually selected
      const hasNewFiles = Object.values(tempFiles).some(file => file !== undefined)
      console.log('Has new files:', hasNewFiles, tempFiles)

      if (hasNewFiles) {
        try {
          const uploadPromises = []
          
          if (tempFiles.contract) {
            console.log('Adding contract file to upload queue:', tempFiles.contract.name)
            uploadPromises.push(
              uploadFile(tempFiles.contract, 'contract', panelId)
                .catch(error => {
                  console.error('Contract upload failed:', error)
                  throw error
                })
            )
          }
          if (tempFiles.rateList) {
            console.log('Adding rate list file to upload queue:', tempFiles.rateList.name)
            uploadPromises.push(
              uploadFile(tempFiles.rateList, 'rateList', panelId)
                .catch(error => {
                  console.error('Rate list upload failed:', error)
                  throw error
                })
            )
          }
          if (tempFiles.logo) {
            console.log('Adding logo file to upload queue:', tempFiles.logo.name)
            uploadPromises.push(
              uploadFile(tempFiles.logo, 'logo', panelId)
                .catch(error => {
                  console.error('Logo upload failed:', error)
                  throw error
                })
            )
          }

          console.log('Starting file uploads:', uploadPromises.length)
          if (uploadPromises.length > 0) {
            const results = await Promise.all(uploadPromises)
            console.log('All uploads completed:', results)
          }
        } catch (error: any) {
          console.error('File upload error details:', {
            error,
            message: error.message,
            stack: error.stack
          })
          throw new Error(`Failed to upload files: ${error.message}`)
        }
      }

      toast({
        title: "Success",
        description: `Panel ${panel ? 'updated' : 'created'} successfully`,
      })
      
      await onSuccess()
      onOpenChange(false)
    } catch (error: any) {
      console.error('[Form] Error:', error)
      toast({
        title: "Error",
        description: error.message || "Failed to save panel",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const uploadFile = async (file: File, type: 'contract' | 'rateList' | 'logo', panelId: string) => {
    console.log(`Starting ${type} upload:`, {
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type,
      panelId
    })

    const formData = new FormData()
    formData.append('file', file)
    formData.append('type', type)
    formData.append('panelId', panelId)

    try {
      const response = await fetch('/api/panels/upload', {
        method: 'POST',
        body: formData
      })

      const data = await response.json()
      console.log(`Upload response for ${type}:`, {
        status: response.status,
        ok: response.ok,
        data
      })

      if (!response.ok) {
        throw new Error(data.error || `Failed to upload ${type}`)
      }

      return data
    } catch (error: any) {
      console.error(`Error uploading ${type}:`, {
        error,
        message: error.message,
        stack: error.stack
      })
      throw error
    }
  }

  const handleFileSelect = (file: File | undefined, type: 'contract' | 'rateList' | 'logo') => {
    if (file) {
      setTempFiles(prev => ({ ...prev, [type]: file }))
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>{panel ? 'Edit Panel' : 'New Panel'}</DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto pr-4 -mr-4">
          <form id="panel-form" onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Logo</Label>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={e => handleFileSelect(e.target.files?.[0], 'logo')}
                />
                {tempFiles.logo && (
                  <p className="text-sm text-muted-foreground">
                    Selected: {tempFiles.logo.name}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Name *</Label>
                <Input
                  required
                  value={formData.name}
                  onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  readOnly={!!panel}
                  className={panel ? "bg-muted" : ""}
                />
              </div>

              <div className="space-y-2">
                <Label>Type *</Label>
                <Select
                  required
                  value={formData.panelType}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, panelType: value }))}
                  disabled={isLoadingTypes}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={isLoadingTypes ? "Loading..." : "Select panel type"} />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.isArray(panelTypes) && panelTypes.map((type) => (
                      <SelectItem key={type.id} value={type.name}>
                        {type.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Start Date *</Label>
                <Input
                  type="date"
                  required
                  value={formData.startDate}
                  onChange={e => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label>Expiry Date *</Label>
                <Input
                  type="date"
                  required={!panel}
                  value={formData.expiryDate || ''}
                  onChange={e => setFormData(prev => ({ ...prev, expiryDate: e.target.value }))}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Claims Email *</Label>
              <Input
                type="email"
                required={!panel}
                value={formData.claimsEmail || ''}
                onChange={e => setFormData(prev => ({ ...prev, claimsEmail: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label>Claims Address *</Label>
              <Textarea
                required={!panel}
                value={formData.claimsAddress || ''}
                onChange={e => setFormData(prev => ({ ...prev, claimsAddress: e.target.value }))}
              />
            </div>

            <div className="space-y-4">
              <Label className="text-base">POC Details</Label>
              <div className="border rounded-lg p-4 space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>POC Name *</Label>
                    <Input
                      required={!panel}
                      value={formData.pocName || ''}
                      onChange={e => setFormData(prev => ({ ...prev, pocName: e.target.value }))}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>POC Phone *</Label>
                    <Input
                      required={!panel}
                      value={formData.pocPhone || ''}
                      onChange={e => setFormData(prev => ({ ...prev, pocPhone: e.target.value }))}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>POC Email *</Label>
                    <Input
                      type="email"
                      required={!panel}
                      value={formData.pocEmail || ''}
                      onChange={e => setFormData(prev => ({ ...prev, pocEmail: e.target.value }))}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-base">Portal Details (Optional)</Label>
                <div className="border rounded-lg p-4 space-y-4">
                  <div className="space-y-2">
                    <Label>Portal Name</Label>
                    <Input
                      value={formData.portalName || ''}
                      onChange={e => setFormData(prev => ({ ...prev, portalName: e.target.value }))}
                      placeholder="Enter portal name"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Portal Link</Label>
                      <Input
                        value={formData.portalCredentials?.portalLink || ''}
                        onChange={e => setFormData(prev => ({
                          ...prev,
                          portalCredentials: {
                            ...prev.portalCredentials,
                            portalLink: e.target.value
                          }
                        }))}
                        placeholder="Enter portal link"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Username</Label>
                      <Input
                        value={formData.portalCredentials?.username || ''}
                        onChange={e => setFormData(prev => ({
                          ...prev,
                          portalCredentials: {
                            ...prev.portalCredentials,
                            username: e.target.value
                          }
                        }))}
                        placeholder="Enter username"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Password</Label>
                      <Input
                        type="password"
                        value={formData.portalCredentials?.password || ''}
                        onChange={e => setFormData(prev => ({
                          ...prev,
                          portalCredentials: {
                            ...prev.portalCredentials,
                            password: e.target.value
                          }
                        }))}
                        placeholder="Enter password"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>{panel ? 'Contract' : 'Contract *'}</Label>
                  <Input
                    type="file"
                    accept=".pdf,image/*"
                    required={!panel}
                    onChange={e => handleFileSelect(e.target.files?.[0], 'contract')}
                  />
                  {tempFiles.contract && (
                    <p className="text-sm text-muted-foreground">
                      Selected: {tempFiles.contract.name}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>{panel ? 'Rate List' : 'Rate List *'}</Label>
                  <Input
                    type="file"
                    accept=".pdf,image/*"
                    required={!panel}
                    onChange={e => handleFileSelect(e.target.files?.[0], 'rateList')}
                  />
                  {tempFiles.rateList && (
                    <p className="text-sm text-muted-foreground">
                      Selected: {tempFiles.rateList.name}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </form>
        </div>

        <div className="flex justify-end gap-4 pt-4 border-t mt-4">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button form="panel-form" type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : (panel ? 'Update' : 'Create')}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
} 