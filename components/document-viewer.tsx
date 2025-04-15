"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { FileText, Download, Eye } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface Document {
  id: number
  name: string
  type: string
  description: string
  uploadDate: string
  size: string
  downloadUrl: string
  viewUrl: string
}

interface DocumentViewerProps {
  documents: Document[]
  title?: string
  description?: string
}

export function DocumentViewer({
  documents,
  title = "Project Documents",
  description = "Access all project-related documents",
}: DocumentViewerProps) {
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null)
  const [previewOpen, setPreviewOpen] = useState(false)

  const handleViewDocument = (document: Document) => {
    setSelectedDocument(document)
    setPreviewOpen(true)
  }

  const handleDownload = (document: Document) => {
    // Open the PDF link in a new tab
    window.open(
      "https://raw.githubusercontent.com/aijesseltoncapital/static/refs/heads/main/HR%20Monster_deck%20.pdf",
      "_blank",
    )
  }

  const getDocumentTypeIcon = (type: string) => {
    switch (type) {
      case "presentation":
        return <FileText className="h-4 w-4 text-blue-500" />
      case "spreadsheet":
        return <FileText className="h-4 w-4 text-green-500" />
      case "document":
      default:
        return <FileText className="h-4 w-4 text-gray-500" />
    }
  }

  const getDocumentTypeBadge = (type: string) => {
    switch (type) {
      case "presentation":
        return (
          <Badge
            variant="outline"
            className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/20 dark:text-blue-400 dark:border-blue-800"
          >
            Presentation
          </Badge>
        )
      case "spreadsheet":
        return (
          <Badge
            variant="outline"
            className="bg-green-50 text-green-700 border-green-200 dark:bg-green-950/20 dark:text-green-400 dark:border-green-800"
          >
            Spreadsheet
          </Badge>
        )
      case "document":
      default:
        return <Badge variant="outline">Document</Badge>
    }
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
          {false ? (
            <div className="text-center py-8 text-muted-foreground">No documents available</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Document</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">
                    <div className="flex items-center">
                      <FileText className="h-4 w-4 text-blue-500" />
                      <span className="ml-2">Pitch Deck</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/20 dark:text-blue-400 dark:border-blue-800"
                    >
                      Presentation
                    </Badge>
                  </TableCell>
                  <TableCell>2025-03-29</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          handleViewDocument({
                            id: 1,
                            name: "Pitch Deck",
                            type: "presentation",
                            description: "Company overview and investment opportunity",
                            uploadDate: "2025-03-29",
                            size: "3.5 MB",
                            downloadUrl: "",
                            viewUrl: "",
                          })
                        }
                      >
                        <Eye className="h-4 w-4" />
                        <span className="sr-only">View</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          handleDownload({
                            id: 1,
                            name: "Pitch Deck",
                            type: "presentation",
                            description: "Company overview and investment opportunity",
                            uploadDate: "2025-03-29",
                            size: "3.5 MB",
                            downloadUrl: "",
                            viewUrl: "",
                          })
                        }
                      >
                        <Download className="h-4 w-4" />
                        <span className="sr-only">Download</span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Document Preview Dialog */}
      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>{selectedDocument?.name}</DialogTitle>
            <DialogDescription>{selectedDocument?.description}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium">Type</p>
                <p className="text-sm capitalize">{selectedDocument?.type}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Size</p>
                <p className="text-sm">{selectedDocument?.size}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Upload Date</p>
                <p className="text-sm">{selectedDocument?.uploadDate}</p>
              </div>
            </div>

            <div className="border rounded-lg overflow-hidden bg-muted/30 h-[500px]">
              {selectedDocument ? (
                <iframe
                  src="https://www.canva.com/design/DAGiJWJ9lQo/37J5y0k0aXKip_0VagTP4Q/view?embed"
                  title={selectedDocument.name}
                  className="w-full h-full"
                  allow="fullscreen"
                  allowFullScreen
                ></iframe>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <FileText className="h-16 w-16 mx-auto text-muted-foreground" />
                    <p className="mt-2 font-medium text-muted-foreground">Select a document to preview</p>
                  </div>
                </div>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPreviewOpen(false)}>
              Close
            </Button>
            <Button onClick={() => selectedDocument && handleDownload(selectedDocument)}>
              <Download className="mr-2 h-4 w-4" />
              Download PDF
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
