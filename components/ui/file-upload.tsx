"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { XCircle, Upload } from "lucide-react"

interface FileUploadProps extends React.InputHTMLAttributes<HTMLInputElement> {
  accept?: string
  maxSize?: number // in bytes
  onFileChange?: (file: File | null) => void
}

export const FileUpload = ({
  id,
  name,
  accept,
  maxSize = 5 * 1024 * 1024, // 5MB default
  required,
  onFileChange,
  ...props
}: FileUploadProps) => {
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null
    
    if (!selectedFile) {
      setFile(null)
      setPreview(null)
      setError(null)
      if (onFileChange) onFileChange(null)
      return
    }
    
    // Check file size
    if (selectedFile.size > maxSize) {
      setError(`File size exceeds ${maxSize / (1024 * 1024)}MB`)
      setFile(null)
      setPreview(null)
      e.target.value = ""
      if (onFileChange) onFileChange(null)
      return
    }
    
    setFile(selectedFile)
    setError(null)
    if (onFileChange) onFileChange(selectedFile)
    
    // Create preview for images
    if (selectedFile.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result as string)
      }
      reader.readAsDataURL(selectedFile)
    } else {
      setPreview(null)
    }
  }
  
  const handleClear = () => {
    setFile(null)
    setPreview(null)
    setError(null)
    if (inputRef.current) {
      inputRef.current.value = ""
    }
    if (onFileChange) onFileChange(null)
  }
  
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Input
          ref={inputRef}
          id={id}
          name={name}
          type="file"
          accept={accept}
          required={required && !file}
          onChange={handleFileChange}
          className={error ? "border-destructive" : ""}
          {...props}
        />
        {file && (
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={handleClear}
            className="flex-shrink-0"
          >
            <XCircle className="h-4 w-4" />
            <span className="sr-only">Clear</span>
          </Button>
        )}
      </div>
      
      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}
      
      {file && !preview && (
        <div className="flex items-center gap-2 text-sm">
          <Upload className="h-4 w-4" />
          <span>{file.name} ({(file.size / 1024).toFixed(1)} KB)</span>
        </div>
      )}
      
      {preview && (
        <div className="relative h-20 w-20 rounded overflow-hidden border">
          <img
            src={preview}
            alt="Preview"
            className="h-full w-full object-cover"
          />
        </div>
      )}
    </div>
  )
} 