'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { FileText, Image, Upload, X } from 'lucide-react'
import { useToast } from '@/components/ui/use-toast'

interface FileUploaderProps {
  onFileUploaded: (url: string, type: 'image' | 'pdf') => void
  existingFileUrl?: string
  existingFileType?: 'image' | 'pdf'
}

export function FileUploader({ 
  onFileUploaded, 
  existingFileUrl, 
  existingFileType 
}: FileUploaderProps) {
  const { toast } = useToast()
  const [isUploading, setIsUploading] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | undefined>(existingFileUrl)
  const [fileType, setFileType] = useState<'image' | 'pdf' | undefined>(existingFileType)
  
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    
    // For demo purposes, we'll just create a local URL
    // In a real app, you would upload to a storage service
    try {
      setIsUploading(true)
      
      // Simulate upload delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const url = URL.createObjectURL(file)
      const type = file.type.startsWith('image/') ? 'image' : 'pdf'
      
      setPreviewUrl(url)
      setFileType(type)
      onFileUploaded(url, type)
      
      toast({
        title: "File uploaded",
        description: "Your file has been uploaded successfully.",
      })
    } catch (error) {
      console.error('Error uploading file:', error)
      toast({
        title: "Upload failed",
        description: "There was an error uploading your file.",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
    }
  }
  
  const handleRemove = () => {
    setPreviewUrl(undefined)
    setFileType(undefined)
    onFileUploaded('', 'image') // Empty URL to clear
  }
  
  return (
    <div className="space-y-4">
      {!previewUrl ? (
        <div className="flex items-center justify-center w-full">
          <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <Upload className="w-8 h-8 mb-3 text-gray-500 dark:text-gray-400" />
              <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                <span className="font-semibold">Click to upload</span> or drag and drop
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                PDF or Image files (MAX. 10MB)
              </p>
            </div>
            <Input 
              id="dropzone-file" 
              type="file" 
              className="hidden" 
              accept="image/*,.pdf"
              onChange={handleFileChange}
              disabled={isUploading}
            />
          </label>
        </div>
      ) : (
        <div className="relative border rounded-lg p-4">
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2"
            onClick={handleRemove}
          >
            <X className="h-4 w-4" />
          </Button>
          
          {fileType === 'image' ? (
            <div className="flex flex-col items-center">
              <Image className="w-6 h-6 mb-2 text-gray-500" />
              <img 
                src={previewUrl} 
                alt="Receipt preview" 
                className="max-h-32 object-contain mt-2" 
              />
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <FileText className="w-6 h-6 mb-2 text-gray-500" />
              <p className="text-sm text-gray-500">PDF Document</p>
              <Button 
                variant="outline" 
                size="sm" 
                className="mt-2"
                onClick={() => window.open(previewUrl, '_blank')}
              >
                View PDF
              </Button>
            </div>
          )}
        </div>
      )}
      
      {isUploading && (
        <div className="text-center text-sm text-muted-foreground">
          Uploading...
        </div>
      )}
    </div>
  )
} 