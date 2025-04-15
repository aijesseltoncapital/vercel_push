"use client"

import type React from "react"

import { useState } from "react"
import { useAuth } from "@/lib/auth-provider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Upload, File, X, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface DocumentUploaderProps {
  onUploadSuccess: (document: any) => void
}

export function DocumentUploader({ onUploadSuccess }: DocumentUploaderProps) {
  const { user } = useAuth()
  const { toast } = useToast()
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [type, setType] = useState("")
  const [category, setCategory] = useState("")
  const [file, setFile] = useState<File | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0]
      setFile(selectedFile)

      // Auto-fill name if not already set
      if (!name) {
        setName(selectedFile.name.split(".").slice(0, -1).join("."))
      }

      // Auto-detect type based on file extension
      const extension = selectedFile.name.split(".").pop()?.toLowerCase()
      if (extension) {
        if (["ppt", "pptx"].includes(extension)) {
          setType("presentation")
        } else if (["xls", "xlsx", "csv"].includes(extension)) {
          setType("spreadsheet")
        } else if (["doc", "docx", "pdf", "txt"].includes(extension)) {
          setType("document")
        }
      }
    }
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
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0]
      setFile(droppedFile)

      // Auto-fill name if not already set
      if (!name) {
        setName(droppedFile.name.split(".").slice(0, -1).join("."))
      }

      // Auto-detect type based on file extension
      const extension = droppedFile.name.split(".").pop()?.toLowerCase()
      if (extension) {
        if (["ppt", "pptx"].includes(extension)) {
          setType("presentation")
        } else if (["xls", "xlsx", "csv"].includes(extension)) {
          setType("spreadsheet")
        } else if (["doc", "docx", "pdf", "txt"].includes(extension)) {
          setType("document")
        }
      }
    }
  }

  const handleRemoveFile = () => {
    setFile(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setUploadError(null)

    if (!file) {
      toast({
        title: "No file selected",
        description: "Please select a file to upload",
        variant: "destructive",
      })
      return
    }

    if (!name) {
      toast({
        title: "Name required",
        description: "Please provide a name for the document",
        variant: "destructive",
      })
      return
    }

    if (!type) {
      toast({
        title: "Type required",
        description: "Please select a document type",
        variant: "destructive",
      })
      return
    }

    if (!category) {
      toast({
        title: "Category required",
        description: "Please select a document category",
        variant: "destructive",
      })
      return
    }

    setIsUploading(true)

    try {
      // Create form data for the API call
      const formData = new FormData()
      formData.append("file", file)
      formData.append("documentType", type)
      formData.append("user_name", user?.name || "Anonymous")
      formData.append("user_email", user?.email || "anonymous@example.com")
      formData.append("description", description)
      formData.append("category", category)

      // Send the file to our Next.js API endpoint which proxies to the Flask backend
      const response = await fetch("/api/tos/upload", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || `Upload failed: ${response.status}`)
      }

      const data = await response.json()

      // Call the success handler with the document data
      onUploadSuccess({
        name,
        description,
        type,
        category,
        size: formatFileSize(file.size),
        url: data.url || "#",
        id: data.id || `temp-${Date.now()}`,
        uploadDate: new Date().toISOString().split("T")[0],
        status: "published",
        version: "1.0",
      })

      // Reset the form
      setName("")
      setDescription("")
      setType("")
      setCategory("")
      setFile(null)
    } catch (error: any) {
      console.error("Upload error:", error)
      setUploadError(error.message || "Failed to upload document")
      toast({
        title: "Upload failed",
        description: error.message || "An error occurred while uploading the document",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
    }
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i]
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="file-upload">Document File</Label>
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
                Supported formats: PDF, DOCX, XLSX, PPTX, CSV, TXT, JPG, PNG (max 16MB)
              </p>
              <Button
                variant="outline"
                size="sm"
                type="button"
                onClick={() => document.getElementById("file-upload")?.click()}
              >
                Select File
              </Button>
            </>
          )}
          <Input
            id="file-upload"
            type="file"
            className="hidden"
            onChange={handleFileChange}
            accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.csv,.txt,.jpg,.jpeg,.png"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Document Name</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter document name"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="type">Document Type</Label>
          <Select value={type} onValueChange={setType} required>
            <SelectTrigger id="type">
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="presentation">Presentation</SelectItem>
              <SelectItem value="spreadsheet">Spreadsheet</SelectItem>
              <SelectItem value="document">Document</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="category">Document Category</Label>
        <Select value={category} onValueChange={setCategory} required>
          <SelectTrigger id="category">
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="investor">Investor Document</SelectItem>
            <SelectItem value="internal">Internal Document</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter a description of the document"
          rows={3}
        />
      </div>

      {uploadError && <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md">{uploadError}</div>}

      <div className="flex justify-end">
        <Button type="submit" disabled={isUploading}>
          {isUploading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Uploading...
            </>
          ) : (
            <>
              <Upload className="mr-2 h-4 w-4" />
              Upload Document
            </>
          )}
        </Button>
      </div>
    </form>
  )
}
