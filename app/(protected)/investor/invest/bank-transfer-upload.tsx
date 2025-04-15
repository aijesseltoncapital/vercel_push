"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Upload, Check } from "lucide-react"

interface BankTransferUploadProps {
  investmentAmount: number
  referenceNumber: string
  onUploadComplete: () => void
}

export function BankTransferUpload({ investmentAmount, referenceNumber, onUploadComplete }: BankTransferUploadProps) {
  const { toast } = useToast()
  const [file, setFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [isDragging, setIsDragging] = useState(false)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
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
      setFile(e.dataTransfer.files[0])
    }
  }

  const handleUpload = () => {
    if (!file) {
      toast({
        title: "No file selected",
        description: "Please select a receipt file to upload",
        variant: "destructive",
      })
      return
    }

    setIsUploading(true)

    // In a real app, this would upload the file to a server
    setTimeout(() => {
      setIsUploading(false)
      toast({
        title: "Receipt uploaded",
        description: "Your bank transfer receipt has been uploaded successfully",
      })
      onUploadComplete()
    }, 2000)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload Bank Transfer Receipt</CardTitle>
        <CardDescription>Please upload a receipt or confirmation of your bank transfer</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Transfer Details</Label>
          <div className="p-4 bg-muted rounded-md">
            <div className="text-sm space-y-1">
              <div className="flex justify-between">
                <span className="font-medium">Amount:</span>
                <span>${investmentAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Reference Number:</span>
                <span>{referenceNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Payment Date:</span>
                <span>March 21, 2025</span>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="receipt">Receipt Upload</Label>
          <div
            className={`border-2 ${isDragging ? "border-primary" : "border-dashed"} ${file ? "bg-primary/5 border-primary/50" : ""} rounded-md p-6 flex flex-col items-center justify-center transition-colors`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            {file ? (
              <>
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                  <Check className="h-5 w-5 text-primary" />
                </div>
                <p className="text-sm font-medium mb-1">File selected</p>
                <p className="text-sm text-muted-foreground mb-2">
                  {file.name} ({(file.size / 1024).toFixed(1)} KB)
                </p>
              </>
            ) : (
              <>
                <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground mb-2">
                  Drag and drop your receipt file, or click to browse
                </p>
              </>
            )}
            <Input
              id="receipt"
              type="file"
              className="hidden"
              onChange={handleFileChange}
              accept=".pdf,.jpg,.jpeg,.png"
            />
            <Button
              variant={file ? "default" : "outline"}
              onClick={() => document.getElementById("receipt")?.click()}
              size="sm"
            >
              {file ? "Change File" : "Select File"}
            </Button>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleUpload} disabled={!file || isUploading} className="w-full">
          {isUploading ? (
            <>
              <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent"></span>
              Uploading...
            </>
          ) : (
            "Upload Receipt"
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}
