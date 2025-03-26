"use client"

import { useState } from "react"
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
import { FileText, Download, Trash2, Eye, Plus, CheckCircle, Clock } from "lucide-react"
import { DocumentUploader } from "./components/document-uploader"

export default function StartupDocumentsPage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [documents, setDocuments] = useState([
    {
      id: 1,
      name: "Pitch Deck",
      type: "presentation",
      category: "investor",
      description: "Company overview and investment opportunity",
      uploadDate: "2023-05-01",
      status: "published",
      version: "1.2",
      size: "3.5 MB",
      downloadUrl: "#",
      viewUrl: "#",
    },
    {
      id: 2,
      name: "Financial Projections",
      type: "spreadsheet",
      category: "investor",
      description: "3-year financial forecast",
      uploadDate: "2023-05-02",
      status: "published",
      version: "1.0",
      size: "1.2 MB",
      downloadUrl: "#",
      viewUrl: "#",
    },
    {
      id: 3,
      name: "Product Roadmap",
      type: "document",
      category: "investor",
      description: "18-month product development plan",
      uploadDate: "2023-05-03",
      status: "draft",
      version: "0.9",
      size: "2.1 MB",
      downloadUrl: "#",
      viewUrl: "#",
    },
    {
      id: 4,
      name: "Team Bios",
      type: "document",
      category: "investor",
      description: "Leadership team backgrounds and experience",
      uploadDate: "2023-05-04",
      status: "published",
      version: "1.1",
      size: "0.8 MB",
      downloadUrl: "#",
      viewUrl: "#",
    },
    {
      id: 5,
      name: "Market Analysis",
      type: "document",
      category: "investor",
      description: "Detailed market research and competitive analysis",
      uploadDate: "2023-05-05",
      status: "published",
      version: "1.0",
      size: "4.2 MB",
      downloadUrl: "#",
      viewUrl: "#",
    },
    {
      id: 6,
      name: "Technical Architecture",
      type: "document",
      category: "internal",
      description: "System architecture and technical specifications",
      uploadDate: "2023-05-06",
      status: "draft",
      version: "0.8",
      size: "2.7 MB",
      downloadUrl: "#",
      viewUrl: "#",
    },
  ])
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false)
  const [selectedDocument, setSelectedDocument] = useState<any>(null)
  const [documentDialogOpen, setDocumentDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [documentToDelete, setDocumentToDelete] = useState<any>(null)
  const [editMode, setEditMode] = useState(false)
  const [editedDocument, setEditedDocument] = useState<any>(null)

  const handleViewDocument = (document: any) => {
    setSelectedDocument(document)
    setDocumentDialogOpen(true)
    setEditMode(false)
  }

  const handleEditDocument = (document: any) => {
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

  const handleDeletePrompt = (document: any) => {
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

  const handlePublishDocument = (document: any) => {
    setDocuments(documents.map((doc) => (doc.id === document.id ? { ...doc, status: "published" } : doc)))

    toast({
      title: "Document published",
      description: "The document is now visible to investors",
    })
  }

  const handleUploadSuccess = (newDocument: any) => {
    // In a real app, this would come from the server with a real ID
    const documentWithId = {
      ...newDocument,
      id: Math.max(...documents.map((d) => d.id)) + 1,
      uploadDate: new Date().toISOString().split("T")[0],
      status: "draft",
      version: "1.0",
      downloadUrl: "#",
      viewUrl: "#",
    }

    setDocuments([documentWithId, ...documents])
    setUploadDialogOpen(false)

    toast({
      title: "Document uploaded",
      description: "Your document has been uploaded successfully",
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

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
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
            <CardContent>
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
                  {documents.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-4 text-muted-foreground">
                        No documents found
                      </TableCell>
                    </TableRow>
                  ) : (
                    documents.map((document) => (
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
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="investor" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Investor Documents</CardTitle>
              <CardDescription>Documents visible to investors</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Upload Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {investorDocuments.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-4 text-muted-foreground">
                        No investor documents found
                      </TableCell>
                    </TableRow>
                  ) : (
                    investorDocuments.map((document) => (
                      <TableRow key={document.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center">
                            {getDocumentTypeIcon(document.type)}
                            <span className="ml-2">{document.name}</span>
                          </div>
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
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="internal" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Internal Documents</CardTitle>
              <CardDescription>Documents for internal use only</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Upload Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {internalDocuments.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-4 text-muted-foreground">
                        No internal documents found
                      </TableCell>
                    </TableRow>
                  ) : (
                    internalDocuments.map((document) => (
                      <TableRow key={document.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center">
                            {getDocumentTypeIcon(document.type)}
                            <span className="ml-2">{document.name}</span>
                          </div>
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
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="published" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Published Documents</CardTitle>
              <CardDescription>Documents visible to investors</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Upload Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {publishedDocuments.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-4 text-muted-foreground">
                        No published documents found
                      </TableCell>
                    </TableRow>
                  ) : (
                    publishedDocuments.map((document) => (
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
                            <Button variant="ghost" size="sm" onClick={() => handleDeletePrompt(document)}>
                              <Trash2 className="h-4 w-4" />
                              <span className="sr-only">Delete</span>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="drafts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Draft Documents</CardTitle>
              <CardDescription>Documents not yet published to investors</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Upload Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {draftDocuments.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-4 text-muted-foreground">
                        No draft documents found
                      </TableCell>
                    </TableRow>
                  ) : (
                    draftDocuments.map((document) => (
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
                            <Button variant="ghost" size="sm" onClick={() => handlePublishDocument(document)}>
                              <CheckCircle className="h-4 w-4" />
                              <span className="sr-only">Publish</span>
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => handleDeletePrompt(document)}>
                              <Trash2 className="h-4 w-4" />
                              <span className="sr-only">Delete</span>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
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
                    <p className="text-sm text-muted-foreground">{selectedDocument.description}</p>
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
                        onChange={(e) => setEditedDocument({ ...editedDocument, name: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="type">Type</Label>
                      <Select
                        value={editedDocument?.type || ""}
                        onValueChange={(value) => setEditedDocument({ ...editedDocument, type: value })}
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
                        onValueChange={(value) => setEditedDocument({ ...editedDocument, category: value })}
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
                        onChange={(e) => setEditedDocument({ ...editedDocument, version: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={editedDocument?.description || ""}
                      onChange={(e) => setEditedDocument({ ...editedDocument, description: e.target.value })}
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
                <Button variant="secondary">
                  <Download className="mr-2 h-4 w-4" />
                  Download
                </Button>
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

