"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FileText, Download, Trash2, Eye, Plus, CheckCircle, Clock, Loader2 } from "lucide-react"
import { DocumentUploader } from "./components/document-uploader"

// Define document interface
interface Document {
  id: string | number
  name: string
  type: string
  category: string
  description?: string
  uploadDate: string
  status: string
  version: string
  size: string
  url?: string
  downloadUrl?: string
  viewUrl?: string
}

export default function StartupDocumentsPage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [documents, setDocuments] = useState<Document[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false)
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null)
  const [documentDialogOpen, setDocumentDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [documentToDelete, setDocumentToDelete] = useState<Document | null>(null)
  const [editMode, setEditMode] = useState(false)
  const [editedDocument, setEditedDocument] = useState<Document | null>(null)

  // Fetch documents from TOS
  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        setIsLoading(true)
        setError(null)

        // Update the URL to match your Flask backend configuration
        // If your Flask blueprint is registered with a prefix, adjust accordingly
        const response = await fetch("/api/tos/documents")

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}))
          throw new Error(errorData.error || `HTTP error ${response.status}`)
        }

        const data = await response.json()

        // Transform data if necessary to match Document interface
        const formattedDocuments = Array.isArray(data)
          ? data.map((doc) => ({
              id: doc.id || doc.key || doc._id || doc.name,
              name: doc.name || "Unnamed Document",
              type: doc.type || "document",
              category: doc.category || "investor",
              description: doc.description || "",
              uploadDate: doc.uploadDate || doc.last_modified || new Date().toISOString().split("T")[0],
              status: doc.status || "published",
              version: doc.version || "1.0",
              size: doc.size || "0 KB",
              url: doc.url,
              downloadUrl: doc.url || doc.downloadUrl,
              viewUrl: doc.url || doc.viewUrl,
            }))
          : []

        setDocuments(formattedDocuments)
      } catch (error: any) {
        console.error("Error fetching documents:", error)
        setError(error.message || "Failed to load documents")
        toast({
          title: "Error loading documents",
          description: error.message || "Failed to load documents from storage",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchDocuments()
  }, [toast])

  const handleViewDocument = (document: Document) => {
    setSelectedDocument(document)
    setDocumentDialogOpen(true)
    setEditMode(false)
  }

  const handleEditDocument = (document: Document) => {
    setSelectedDocument(document)
    setEditedDocument({ ...document })
    setDocumentDialogOpen(true)
    setEditMode(true)
  }

  const handleSaveEdit = () => {
    if (!editedDocument) return

    setDocuments(documents.map((doc) => (doc.id === editedDocument.id ? editedDocument : doc)))

    toast({
      title: "Document updated",
      description: "The document details have been updated successfully",
    })

    setDocumentDialogOpen(false)
  }

  const handleDeletePrompt = (document: Document) => {
    setDocumentToDelete(document)
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = () => {
    if (!documentToDelete) return

    setDocuments(documents.filter((doc) => doc.id !== documentToDelete.id))

    toast({
      title: "Document deleted",
      description: "The document has been deleted successfully",
    })

    setDeleteDialogOpen(false)
  }

  const handlePublishDocument = (document: Document) => {
    setDocuments(documents.map((doc) => (doc.id === document.id ? { ...doc, status: "published" } : doc)))

    toast({
      title: "Document published",
      description: "The document is now visible to investors",
    })
  }

  const handleUploadSuccess = (newDocument: any) => {
    // Refresh the document list from the server
    setIsLoading(true)
    // Update the URL to match your Flask backend configuration
    fetch("/api/tos/documents")
      .then((response) => {
        if (!response.ok) throw new Error("Failed to fetch updated documents")
        return response.json()
      })
      .then((data) => {
        // Transform data if necessary to match Document interface
        const formattedDocuments = Array.isArray(data)
          ? data.map((doc) => ({
              id: doc.id || doc.key || doc._id || doc.name,
              name: doc.name || "Unnamed Document",
              type: doc.type || "document",
              category: doc.category || "investor",
              description: doc.description || "",
              uploadDate: doc.uploadDate || doc.last_modified || new Date().toISOString().split("T")[0],
              status: doc.status || "published",
              version: doc.version || "1.0",
              size: doc.size || "0 KB",
              url: doc.url,
              downloadUrl: doc.url || doc.downloadUrl,
              viewUrl: doc.url || doc.viewUrl,
            }))
          : []

        setDocuments(formattedDocuments)
        setUploadDialogOpen(false)

        toast({
          title: "Document uploaded",
          description: "Your document has been uploaded successfully",
        })
      })
      .catch((error) => {
        console.error("Error refreshing documents:", error)
        toast({
          title: "Error",
          description: "Document was uploaded but the list couldn't be refreshed",
          variant: "destructive",
        })
      })
      .finally(() => {
        setIsLoading(false)
      })
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "published":
        return (
          <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
            <CheckCircle className="mr-1 h-3 w-3" />
            Published
          </Badge>
        )
      case "draft":
        return (
          <Badge variant="outline" className="text-yellow-800 dark:text-yellow-300">
            <Clock className="mr-1 h-3 w-3" />
            Draft
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
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

  const investorDocuments = documents.filter((doc) => doc.category === "investor")
  const internalDocuments = documents.filter((doc) => doc.category === "internal")
  const publishedDocuments = documents.filter((doc) => doc.status === "published")
  const draftDocuments = documents.filter((doc) => doc.status === "draft")

  const renderDocumentList = (documentList: Document[]) => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2">Loading documents...</span>
        </div>
      )
    }

    if (error) {
      return (
        <div className="text-center py-8">
          <p className="text-destructive">Error: {error}</p>
          <Button onClick={() => window.location.reload()} className="mt-4">
            Retry
          </Button>
        </div>
      )
    }

    if (documentList.length === 0) {
      return (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No documents found</p>
          <Button onClick={() => setUploadDialogOpen(true)} className="mt-4">
            <Plus className="mr-2 h-4 w-4" />
            Upload Document
          </Button>
        </div>
      )
    }

    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Upload Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {documentList.map((document) => (
            <TableRow key={document.id}>
              <TableCell className="font-medium">
                <div className="flex items-center">
                  {getDocumentTypeIcon(document.type)}
                  <span className="ml-2">{document.name}</span>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant="outline">{document.category === "investor" ? "Investor" : "Internal"}</Badge>
              </TableCell>
              <TableCell>{document.uploadDate}</TableCell>
              <TableCell>{getStatusBadge(document.status)}</TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Button variant="ghost" size="sm" onClick={() => handleViewDocument(document)}>
                    <Eye className="h-4 w-4" />
                    <span className="sr-only">View</span>
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleEditDocument(document)}>
                    <FileText className="h-4 w-4" />
                    <span className="sr-only">Edit</span>
                  </Button>
                  {document.status === "draft" && (
                    <Button variant="ghost" size="sm" onClick={() => handlePublishDocument(document)}>
                      <CheckCircle className="h-4 w-4" />
                      <span className="sr-only">Publish</span>
                    </Button>
                  )}
                  <Button variant="ghost" size="sm" onClick={() => handleDeletePrompt(document)}>
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Delete</span>
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    )
  }

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2 mt-20">
        <h2 className="text-3xl font-bold tracking-tight">Documents</h2>
        <Button onClick={() => setUploadDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Upload Document
        </Button>
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Documents</TabsTrigger>
          <TabsTrigger value="investor">Investor Documents</TabsTrigger>
          <TabsTrigger value="internal">Internal Documents</TabsTrigger>
          <TabsTrigger value="published">Published</TabsTrigger>
          <TabsTrigger value="drafts">Drafts</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>All Documents</CardTitle>
              <CardDescription>Manage all your project documents</CardDescription>
            </CardHeader>
            <CardContent>{renderDocumentList(documents)}</CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="investor" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Investor Documents</CardTitle>
              <CardDescription>Documents visible to investors</CardDescription>
            </CardHeader>
            <CardContent>{renderDocumentList(investorDocuments)}</CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="internal" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Internal Documents</CardTitle>
              <CardDescription>Documents for internal use only</CardDescription>
            </CardHeader>
            <CardContent>{renderDocumentList(internalDocuments)}</CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="published" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Published Documents</CardTitle>
              <CardDescription>Documents visible to investors</CardDescription>
            </CardHeader>
            <CardContent>{renderDocumentList(publishedDocuments)}</CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="drafts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Draft Documents</CardTitle>
              <CardDescription>Documents not yet published to investors</CardDescription>
            </CardHeader>
            <CardContent>{renderDocumentList(draftDocuments)}</CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Upload Document Dialog */}
      <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Upload Document</DialogTitle>
            <DialogDescription>Upload a document to share with investors or for internal use</DialogDescription>
          </DialogHeader>
          <DocumentUploader onUploadSuccess={handleUploadSuccess} />
        </DialogContent>
      </Dialog>

      {/* View/Edit Document Dialog */}
      <Dialog open={documentDialogOpen} onOpenChange={setDocumentDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{editMode ? "Edit Document" : "Document Details"}</DialogTitle>
            <DialogDescription>{editMode ? "Update document information" : "View document details"}</DialogDescription>
          </DialogHeader>
          {selectedDocument && (
            <div className="space-y-4">
              {!editMode ? (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-sm font-medium">Name</h3>
                      <p>{selectedDocument.name}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium">Type</h3>
                      <p className="capitalize">{selectedDocument.type}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium">Category</h3>
                      <p className="capitalize">{selectedDocument.category}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium">Status</h3>
                      <div className="mt-1">{getStatusBadge(selectedDocument.status)}</div>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium">Upload Date</h3>
                      <p>{selectedDocument.uploadDate}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium">Size</h3>
                      <p>{selectedDocument.size}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium">Version</h3>
                      <p>{selectedDocument.version}</p>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium">Description</h3>
                    <p className="text-sm text-muted-foreground">
                      {selectedDocument.description || "No description provided"}
                    </p>
                  </div>
                  <div className="border rounded-lg p-4 bg-muted/30 flex items-center justify-center h-64">
                    <div className="text-center">
                      <FileText className="h-16 w-16 mx-auto text-muted-foreground" />
                      <p className="mt-2 font-medium">{selectedDocument.name}</p>
                      <p className="text-sm text-muted-foreground">{selectedDocument.size}</p>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Name</Label>
                      <Input
                        id="name"
                        value={editedDocument?.name || ""}
                        onChange={(e) =>
                          setEditedDocument(
                            editedDocument
                              ? {
                                  ...editedDocument,
                                  name: e.target.value,
                                }
                              : null,
                          )
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="type">Type</Label>
                      <Select
                        value={editedDocument?.type || ""}
                        onValueChange={(value) =>
                          setEditedDocument(
                            editedDocument
                              ? {
                                  ...editedDocument,
                                  type: value,
                                }
                              : null,
                          )
                        }
                      >
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
                    <div className="space-y-2">
                      <Label htmlFor="category">Category</Label>
                      <Select
                        value={editedDocument?.category || ""}
                        onValueChange={(value) =>
                          setEditedDocument(
                            editedDocument
                              ? {
                                  ...editedDocument,
                                  category: value,
                                }
                              : null,
                          )
                        }
                      >
                        <SelectTrigger id="category">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="investor">Investor</SelectItem>
                          <SelectItem value="internal">Internal</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="version">Version</Label>
                      <Input
                        id="version"
                        value={editedDocument?.version || ""}
                        onChange={(e) =>
                          setEditedDocument(
                            editedDocument
                              ? {
                                  ...editedDocument,
                                  version: e.target.value,
                                }
                              : null,
                          )
                        }
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={editedDocument?.description || ""}
                      onChange={(e) =>
                        setEditedDocument(
                          editedDocument
                            ? {
                                ...editedDocument,
                                description: e.target.value,
                              }
                            : null,
                        )
                      }
                      rows={3}
                    />
                  </div>
                </>
              )}
            </div>
          )}
          <DialogFooter>
            {!editMode ? (
              <div className="flex space-x-2">
                <Button variant="outline" onClick={() => setDocumentDialogOpen(false)}>
                  Close
                </Button>
                <Button onClick={() => setEditMode(true)}>Edit</Button>
                <a
                  href={selectedDocument?.url || selectedDocument?.downloadUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-secondary text-secondary-foreground h-10 px-4 py-2"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download
                </a>
              </div>
            ) : (
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setEditMode(false)
                    setEditedDocument(null)
                  }}
                >
                  Cancel
                </Button>
                <Button onClick={handleSaveEdit}>Save Changes</Button>
              </div>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this document? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center p-4 border rounded-lg bg-muted/30">
            <FileText className="h-8 w-8 mr-4 text-muted-foreground" />
            <div>
              <p className="font-medium">{documentToDelete?.name}</p>
              <p className="text-sm text-muted-foreground">{documentToDelete?.size}</p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteConfirm}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
