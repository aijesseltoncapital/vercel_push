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
import { Input } from "@/components/ui/input"
import { FileText, Download, Eye, Search } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"

export default function DocumentsPage() {
  const { toast } = useToast()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedDocument, setSelectedDocument] = useState<any>(null)
  const [previewOpen, setPreviewOpen] = useState(false)

  // Mock data for documents
  const documents = [
    {
      id: 1,
      name: "Pitch Deck",
      type: "presentation",
      category: "Company Overview",
      description: "Company overview and investment opportunity",
      uploadDate: "2023-05-01",
      size: "3.5 MB",
      downloadUrl: "#",
      viewUrl: "#",
    },
    {
      id: 2,
      name: "Financial Projections",
      type: "spreadsheet",
      category: "Financial",
      description: "3-year financial forecast",
      uploadDate: "2023-05-02",
      size: "1.2 MB",
      downloadUrl: "#",
      viewUrl: "#",
    },
    {
      id: 3,
      name: "Product Roadmap",
      type: "document",
      category: "Product",
      description: "18-month product development plan",
      uploadDate: "2023-05-03",
      size: "2.1 MB",
      downloadUrl: "#",
      viewUrl: "#",
    },
    {
      id: 4,
      name: "Team Bios",
      type: "document",
      category: "Team",
      description: "Leadership team backgrounds and experience",
      uploadDate: "2023-05-04",
      size: "0.8 MB",
      downloadUrl: "#",
      viewUrl: "#",
    },
    {
      id: 5,
      name: "Market Analysis",
      type: "document",
      category: "Market",
      description: "Detailed market research and competitive analysis",
      uploadDate: "2023-05-05",
      size: "4.2 MB",
      downloadUrl: "#",
      viewUrl: "#",
    },
    {
      id: 6,
      name: "SAFE Agreement",
      type: "document",
      category: "Legal",
      description: "Simple Agreement for Future Equity",
      uploadDate: "2023-05-06",
      size: "0.5 MB",
      downloadUrl: "#",
      viewUrl: "#",
    },
    {
      id: 7,
      name: "Cap Table",
      type: "spreadsheet",
      category: "Financial",
      description: "Current capitalization table",
      uploadDate: "2023-05-07",
      size: "0.3 MB",
      downloadUrl: "#",
      viewUrl: "#",
    },
    {
      id: 8,
      name: "Investor FAQ",
      type: "document",
      category: "Investor Relations",
      description: "Frequently asked questions for investors",
      uploadDate: "2023-05-08",
      size: "0.2 MB",
      downloadUrl: "#",
      viewUrl: "#",
    },
  ]

  const handleViewDocument = (document: any) => {
    setSelectedDocument(document)
    setPreviewOpen(true)
  }

  const handleDownload = (document: any) => {
    // In a real app, this would download the document
    toast({
      title: "Download started",
      description: `${document.name} is being downloaded`,
    })
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

  const filteredDocuments = documents.filter(
    (document) =>
      document.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      document.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      document.description.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Documents</h2>
      </div>

      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search documents..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Project Documents</CardTitle>
          <CardDescription>Access all documents related to Tech Startup XYZ</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Document</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Size</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDocuments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-4 text-muted-foreground">
                    No documents found
                  </TableCell>
                </TableRow>
              ) : (
                filteredDocuments.map((document) => (
                  <TableRow key={document.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center">
                        {getDocumentTypeIcon(document.type)}
                        <span className="ml-2">{document.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{document.category}</Badge>
                    </TableCell>
                    <TableCell>{getDocumentTypeBadge(document.type)}</TableCell>
                    <TableCell>{document.uploadDate}</TableCell>
                    <TableCell>{document.size}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="sm" onClick={() => handleViewDocument(document)}>
                          <Eye className="h-4 w-4" />
                          <span className="sr-only">View</span>
                        </Button>
                        {document.id !== 1 && (
                          <Button variant="ghost" size="sm" onClick={() => handleDownload(document)}>
                            <Download className="h-4 w-4" />
                            <span className="sr-only">Download</span>
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
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
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-sm font-medium">Type</p>
                <p className="text-sm capitalize">{selectedDocument?.type}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Category</p>
                <p className="text-sm">{selectedDocument?.category}</p>
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

            <div className="border rounded-lg p-4 bg-muted/30 flex items-center justify-center h-64">
              <div className="text-center">
                <FileText className="h-16 w-16 mx-auto text-muted-foreground" />
                <p className="mt-2 font-medium">{selectedDocument?.name}</p>
                <p className="text-sm text-muted-foreground">{selectedDocument?.size}</p>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPreviewOpen(false)}>
              Close
            </Button>
            {selectedDocument && selectedDocument.id !== 1 && (
              <Button onClick={() => selectedDocument && handleDownload(selectedDocument)}>
                <Download className="mr-2 h-4 w-4" />
                Download
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
