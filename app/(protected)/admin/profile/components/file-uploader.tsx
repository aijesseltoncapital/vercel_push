"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Upload, File, X } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface FileUploaderProps {
  onFileUpload: (file: File) => void
  acceptedFileTypes: string
  maxFileSize: number // in MB
  multiple?: boolean
}

export function FileUploader({ onFileUpload, acceptedFileTypes, maxFileSize, multiple = false }: FileUploaderProps) {
  const [file, setFile] = useState<File | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0]
      validateAndSetFile(selectedFile)
    }
  }

  const validateAndSetFile = (selectedFile: File) => {
    // Check file type
    const fileExtension = `.${selectedFile.name.split(".").pop()?.toLowerCase()}`
    const isValidType = acceptedFileTypes
      .split(",")
      .some((type) => type.trim() === fileExtension || type.trim() === "*")

    if (!isValidType) {
      toast({
        title: "Invalid file type",
        description: `Please upload a file with one of these extensions: ${acceptedFileTypes}`,
        variant: "destructive",
      })
      return
    }

    // Check file size
    const fileSizeInMB = selectedFile.size / (1024 * 1024)
    if (fileSizeInMB > maxFileSize) {
      toast({
        title: "File too large",
        description: `File size must be less than ${maxFileSize}MB`,
        variant: "destructive",
      })
      return
    }

    setFile(selectedFile)
    onFileUpload(selectedFile)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      validateAndSetFile(e.dataTransfer.files[0])
    }
  }

  const handleRemoveFile = () => {
    setFile(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  return (
    <div>
      <div
        className={`border-2 ${isDragging ? "border-primary" : "border-dashed"} ${file ? "bg-primary/5 border-primary/50" : ""} rounded-md p-6 flex flex-col items-center justify-center transition-colors`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {file ? (
          <div className="flex flex-col items-center">
            <div className="relative">
              <File className="h-16 w-16 text-primary" />
              <button
                type="button"
                onClick={handleRemoveFile}
                className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <p className="text-sm font-medium mt-2">{file.name}</p>
            <p className="text-xs text-muted-foreground">{formatFileSize(file.size)}</p>
          </div>
        ) : (
          <>
            <Upload className="h-10 w-10 text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground mb-2">Drag and drop your file here, or click to browse</p>
            <p className="text-xs text-muted-foreground mb-4">
              Accepted formats: {acceptedFileTypes.replace(/\./g, "")} (max {maxFileSize}MB)
            </p>
            <Button variant="outline" size="sm" type="button" onClick={() => fileInputRef.current?.click()}>
              Select File
            </Button>
          </>
        )}
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          onChange={handleFileChange}
          accept={acceptedFileTypes}
          multiple={multiple}
        />
      </div>
    </div>
  )
}
