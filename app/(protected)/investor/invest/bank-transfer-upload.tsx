"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Upload, Check, Copy } from "lucide-react"
import { useAuth } from "@/lib/auth-provider"

interface BankTransferUploadProps {
  investmentAmount: number
  referenceNumber: string
  onUploadComplete: () => void
}

export function BankTransferUpload({ investmentAmount, referenceNumber, onUploadComplete }: BankTransferUploadProps) {
  const { toast } = useToast()
  const { user } = useAuth()
  const [file, setFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
      setUploadError(null)
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
      setUploadError(null)
    }
  }

  const handleUpload = async () => {
    if (!file) {
      toast({
        title: "No file selected",
        description: "Please select a receipt file to upload",
        variant: "destructive",
      })
      return
    }

    // Validate file type and size
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "application/pdf"]

    if (!allowedTypes.includes(file.type)) {
      setUploadError("Invalid file type. Please upload a PDF, JPG, or PNG file.")
      toast({
        title: "Invalid file type",
        description: "Please upload a PDF, JPG, or PNG file.",
        variant: "destructive",
      })
      return
    }

    if (file.size > 16 * 1024 * 1024) {
      // 16MB limit
      setUploadError("File too large. Maximum size is 16MB.")
      toast({
        title: "File too large",
        description: "Maximum file size is 16MB.",
        variant: "destructive",
      })
      return
    }

    setUploadError(null)

    try {
      // Create form data for the API request
      const formData = new FormData()
      formData.append("file", file)
      formData.append("user_name", user?.name || "Unknown User")
      formData.append("user_email", user?.email || "unknown@example.com")
      formData.append("documentType", "PAYMENT_RECEIPT")
      formData.append("description", `Payment receipt for reference ${referenceNumber} - $${investmentAmount}`)
      formData.append("category", "payment")

      // Make the API request to upload to TOS
      const response = await fetch("https://api.fundcrane.com/tos/upload", {
        method: "POST",
        body: formData,
        credentials: "include",
      })

      if (!response.ok) {
        let errorMessage = "Failed to upload receipt"
        try {
          const errorData = await response.json()
          errorMessage = errorData.error || errorData.message || errorMessage
        } catch (e) {
          // If JSON parsing fails, use the default error message
        }

        throw new Error(errorMessage)
      }

      const data = await response.json()

      // Log success
      console.log("Receipt uploaded successfully:", data)

      // Show success message
      toast({
        title: "Receipt uploaded",
        description: "Your bank transfer receipt has been uploaded successfully. It will be reviewed by our team.",
      })

      // Call the completion handler
      onUploadComplete()
    } catch (error: any) {
      console.error("Error uploading receipt:", error)
      setUploadError(error.message || "Failed to upload receipt. Please try again later.")
      toast({
        title: "Upload failed",
        description: error.message || "Failed to upload receipt. Please try again later.",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
    }
  }

  const copyToClipboard = (text: string, description: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Copied",
      description: description,
    })
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
            <div className="text-sm space-y-3">
              <div className="pb-2 border-b">
                <h4 className="font-medium mb-1">Payment Information</h4>
                <div className="space-y-1">
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

              <div className="pt-1">
                <h4 className="font-medium mb-1">Receiver Bank Account</h4>
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Account Name:</span>
                    <div className="flex items-center">
                      <span>hco strategy pte ltd</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0 ml-1"
                        onClick={() => copyToClipboard("hco strategy pte ltd", "Account name copied to clipboard")}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Account Number:</span>
                    <div className="flex items-center">
                      <span>206-046-58</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0 ml-1"
                        onClick={() => copyToClipboard("206-046-58", "Account number copied to clipboard")}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Bank Code:</span>
                    <div className="flex items-center">
                      <span>0516</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0 ml-1"
                        onClick={() => copyToClipboard("0516", "Bank code copied to clipboard")}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Swift/BIC:</span>
                    <div className="flex items-center">
                      <span>TRWISGSGXXX</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0 ml-1"
                        onClick={() => copyToClipboard("TRWISGSGXXX", "Swift/BIC code copied to clipboard")}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Bank Name:</span>
                    <div className="flex items-center">
                      <span>Wise Asia-Pacific Pte. Ltd.</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0 ml-1"
                        onClick={() => copyToClipboard("Wise Asia-Pacific Pte. Ltd.", "Bank name copied to clipboard")}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Bank Address:</span>
                    <div className="flex items-center">
                      <span className="text-right">2 Tanjong Katong Road, #07-01, PLQ3, Singapore, 437161</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0 ml-1"
                        onClick={() =>
                          copyToClipboard(
                            "2 Tanjong Katong Road, #07-01, PLQ3, Singapore, 437161",
                            "Bank address copied to clipboard",
                          )
                        }
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-1 text-xs text-muted-foreground">
                <p>If you're sending money from a bank in Singapore, use the Bank Code for a domestic transfer.</p>
                <p>If you're sending from outside Singapore, use the Swift/BIC code for an international transfer.</p>
                <p className="font-medium mt-1">Always include your reference number: {referenceNumber}</p>
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
