"use client"

import type React from "react"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { DragDropContext, Droppable, Draggable } from "@/components/drag-drop"
import { ContentBlock } from "./components/content-block"
import { ContentBlockEditor } from "./components/content-block-editor"
import { FileUploader } from "./components/file-uploader"
import { DatePicker } from "./components/date-picker"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  AlertCircle,
  Save,
  Trash,
  MoveUp,
  MoveDown,
  Eye,
  ImageIcon,
  FileText,
  BarChart,
  TableIcon,
  Video,
  Plus,
} from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function ProfilePage() {
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("company")
  const [editingBlock, setEditingBlock] = useState<any>(null)
  const [showBlockEditor, setShowBlockEditor] = useState(false)

  // Add state for publish dialog
  const [showPublishDialog, setShowPublishDialog] = useState(false)
  const [publishErrors, setPublishErrors] = useState<string[]>([])

  // Add state for table dialog
  const [showTableDialog, setShowTableDialog] = useState(false)
  const [tableSection, setTableSection] = useState("")
  const [tableRows, setTableRows] = useState(3)
  const [tableColumns, setTableColumns] = useState(3)

  // State for form data
  const [formData, setFormData] = useState({
    // Company Information
    companyName: "",
    title: "",
    website: "",
    industry: "",
    moneyRaised: "",
    countryOfIncorporation: "",
    oneLineDescription: "",
    headquarters: "",

    // Content blocks for different sections
    introduction: [],
    problem: [],
    solution: [],
    productService: [],
    businessModel: [],
    traction: [],
    targetCustomer: [],
    testimonials: [],
    marketInsights: [],
    competitiveAdvantages: [],
    fiveYearVision: [],
    productRoadmap: [],
    team: [],
    companyStructure: [],
    organizationChart: [],
    keyPartners: [],

    // Finance
    fundingMethod: "",
    round: "",
    instrument: "",
    valuation: "",
    fundingAmount: "",
    useOfFund: [],
    deadline: "",
    minimumTicket: "",
    investmentSummary: [],
    fiveYearProjections: [],

    // Attachments
    pitchDeck: null,
    nda: null,
    otherDocuments: [],

    // Additional Information
    raiseStructure: "",
  })

  // Industry options
  const industryOptions = [
    "Consumer",
    "Manufacturing",
    "Services",
    "Transportation",
    "Wellness",
    "Media",
    "Real Estate",
    "Arts & Entertainment",
    "Aerospace",
    "Sports",
    "Infrastructure",
    "Education",
    "Cannabis",
    "Travel",
    "Energy",
    "Finance",
    "Gaming",
    "Healthcare",
    "Food & Drinks",
    "Technology",
    "Agriculture",
    "Fashion",
    "HR",
    "Other",
  ]

  // Funding method options
  const fundingMethodOptions = [
    "SAFE",
    "Convertible Note",
    "Equity",
    "Debt/Revenue Share",
    "Utility Token Sale",
    "Token Sale",
    "Tokenized SAFE or Convertible Note",
    "Tokenized Equity",
    "Tokenized Debt or Revenue Share",
    "Other",
  ]

  // Round options
  const roundOptions = [
    "Pre-seed",
    "Seed",
    "Series A",
    "Series B",
    "Series C",
    "Series D (and beyond)",
    "Mezzanine/Bridge Financing",
    "IPO (Initial Public Offering)",
    "Revenue-Based Financing",
    "Crowdfunding Securities",
    "SPVs (Special Purpose Vehicles)",
    "Tokenized Securities",
  ]

  // Instrument options
  const instrumentOptions = [
    "Common Stock",
    "Preferred Stock",
    "Stock Options",
    "Restricted Stock Units (RSUs)",
    "Convertible Notes",
    "SAFE (Simple Agreement for Future Equity)",
    "KISS (Keep It Simple Security)",
    "Venture Debt",
  ]

  // Block types
  const blockTypes = [
    { id: "text", label: "Text Paragraph", icon: <FileText className="h-4 w-4 mr-2" /> },
    { id: "image", label: "Image", icon: <ImageIcon className="h-4 w-4 mr-2" /> },
    { id: "video", label: "Video", icon: <Video className="h-4 w-4 mr-2" /> },
    { id: "chart", label: "Chart", icon: <BarChart className="h-4 w-4 mr-2" /> },
    { id: "table", label: "Table", icon: <TableIcon className="h-4 w-4 mr-2" /> },
  ]

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  // Handle select change
  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  // Add a new content block
  const addContentBlock = (section: string, type: string) => {
    const newBlock = {
      id: `block-${Date.now()}`,
      type,
      content: type === "text" ? "Enter your text here..." : "",
      caption: type === "image" ? "Image caption" : "",
      url:
        type === "image"
          ? "/placeholder.svg?height=300&width=500"
          : type === "video"
            ? "https://www.youtube.com/embed/dQw4w9WgXcQ"
            : "",
      data: type === "chart" || type === "table" ? [] : null,
    }

    setFormData((prev) => ({
      ...prev,
      [section]: [...(prev[section as keyof typeof prev] as any[]), newBlock],
    }))
  }

  // Add a new table block with specified dimensions
  const addTableBlock = (section: string, rows: number, columns: number) => {
    // Create empty table data structure
    const tableData = {
      headers: Array(columns)
        .fill("")
        .map((_, i) => `Column ${i + 1}`),
      rows: Array(rows)
        .fill("")
        .map((_, i) => ({
          id: `row-${i}`,
          cells: Array(columns)
            .fill("")
            .map((_, j) => `Cell ${i + 1},${j + 1}`),
        })),
    }

    const newBlock = {
      id: `block-${Date.now()}`,
      type: "table",
      content: "",
      caption: "Table caption",
      data: tableData,
    }

    setFormData((prev) => ({
      ...prev,
      [section]: [...(prev[section as keyof typeof prev] as any[]), newBlock],
    }))

    // Close the dialog
    setShowTableDialog(false)
  }

  // Open table dialog
  const openTableDialog = (section: string) => {
    setTableSection(section)
    setTableRows(3)
    setTableColumns(3)
    setShowTableDialog(true)
  }

  // Remove a content block
  const removeContentBlock = (section: string, blockId: string) => {
    setFormData((prev) => ({
      ...prev,
      [section]: (prev[section as keyof typeof prev] as any[]).filter((block) => block.id !== blockId),
    }))
  }

  // Edit a content block
  const editContentBlock = (section: string, blockId: string) => {
    const block = (formData[section as keyof typeof formData] as any[]).find((block) => block.id === blockId)
    setEditingBlock({ section, block })
    setShowBlockEditor(true)
  }

  // Save edited content block
  const saveContentBlock = (section: string, updatedBlock: any) => {
    setFormData((prev) => ({
      ...prev,
      [section]: (prev[section as keyof typeof prev] as any[]).map((block) =>
        block.id === updatedBlock.id ? updatedBlock : block,
      ),
    }))
    setShowBlockEditor(false)
    setEditingBlock(null)
  }

  // Handle drag and drop reordering
  const handleDragEnd = (result: any, section: string) => {
    if (!result.destination) return

    const items = Array.from(formData[section as keyof typeof formData] as any[])
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)

    setFormData((prev) => ({
      ...prev,
      [section]: items,
    }))
  }

  // Move block up
  const moveBlockUp = (section: string, index: number) => {
    if (index === 0) return

    const items = Array.from(formData[section as keyof typeof formData] as any[])
    const temp = items[index]
    items[index] = items[index - 1]
    items[index - 1] = temp

    setFormData((prev) => ({
      ...prev,
      [section]: items,
    }))
  }

  // Move block down
  const moveBlockDown = (section: string, index: number) => {
    const items = Array.from(formData[section as keyof typeof formData] as any[])
    if (index === items.length - 1) return

    const temp = items[index]
    items[index] = items[index + 1]
    items[index + 1] = temp

    setFormData((prev) => ({
      ...prev,
      [section]: items,
    }))
  }

  // Handle file upload
  const handleFileUpload = (name: string, file: File) => {
    setFormData((prev) => ({
      ...prev,
      [name]: file,
    }))

    toast({
      title: "File uploaded",
      description: `${file.name} has been uploaded successfully.`,
    })
  }

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // In a real app, this would send the data to the server
    console.log(formData)

    toast({
      title: "Profile saved",
      description: "Your company profile has been saved successfully.",
    })
  }

  // Preview the profile
  const handlePreview = () => {
    // In a real app, this would open a preview of the investor-facing page
    toast({
      title: "Preview mode",
      description: "Opening preview of your investor profile.",
    })
  }

  // Add this function after handleSubmit
  const validateForPublish = () => {
    const errors: string[] = []

    // Check Company section
    if (!formData.companyName) errors.push("Company Name is required")
    if (!formData.oneLineDescription) errors.push("1-Sentence Description is required")
    if (!formData.industry) errors.push("Industry is required")
    if (formData.introduction.length === 0) errors.push("Company Introduction is required")

    // Check Problem section
    if (formData.problem.length === 0) errors.push("Problem description is required")

    // Check Solution section
    if (formData.solution.length === 0) errors.push("Solution description is required")

    // Check Team section
    if (formData.team.length === 0) errors.push("Team information is required")

    // Check Finance section
    if (!formData.fundingMethod) errors.push("Funding Method is required")
    if (!formData.round) errors.push("Funding Round is required")
    if (!formData.fundingAmount) errors.push("Funding Amount is required")
    if (!formData.valuation) errors.push("Valuation is required")
    if (formData.useOfFund.length === 0) errors.push("Use of Fund is required")

    // Check Attachments section
    if (!formData.pitchDeck) errors.push("Pitch Deck is required")

    return errors
  }

  // Add publish function
  const handlePublish = () => {
    const errors = validateForPublish()

    if (errors.length > 0) {
      setPublishErrors(errors)
      setShowPublishDialog(true)
      return
    }

    // In a real app, this would call a server action to publish the profile
    console.log("Publishing profile:", formData)

    toast({
      title: "Profile published",
      description: "Your company profile has been published and is now visible to investors.",
    })

    // Redirect to dashboard or show success message
    // window.location.href = "/admin/dashboard"
  }

  // Render content blocks for a section
  const renderContentBlocks = (section: string) => {
    const blocks = formData[section as keyof typeof formData] as any[]

    return (
      <DragDropContext onDragEnd={(result) => handleDragEnd(result, section)}>
        <Droppable droppableId={section}>
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-4">
              {blocks.map((block, index) => (
                <Draggable key={block.id} draggableId={block.id} index={index}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className="border rounded-md p-4 bg-card"
                    >
                      <div className="flex justify-between items-center mb-2">
                        <div className="font-medium">
                          {blockTypes.find((t) => t.id === block.type)?.label || "Block"}
                        </div>
                        <div className="flex space-x-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => moveBlockUp(section, index)}
                            disabled={index === 0}
                          >
                            <MoveUp className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => moveBlockDown(section, index)}
                            disabled={index === blocks.length - 1}
                          >
                            <MoveDown className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => editContentBlock(section, block.id)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => removeContentBlock(section, block.id)}>
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <ContentBlock block={block} />
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    )
  }

  // Add this state at the top level of the component, with the other state declarations
  const [sectionMenuState, setSectionMenuState] = useState<{ [key: string]: boolean }>({})

  // Render block type selector
  const renderBlockTypeSelector = (section: string) => {
    const toggleMenu = (sectionId: string) => {
      setSectionMenuState((prev) => ({
        ...prev,
        [sectionId]: !prev[sectionId],
      }))
    }

    return (
      <div className="mt-6 relative">
        <div
          className={`flex items-center justify-center h-20 border-2 border-dashed rounded-md transition-colors ${sectionMenuState[section] ? "bg-muted" : "bg-background hover:bg-muted/50"}`}
          onClick={() => toggleMenu(section)}
        >
          <div className="flex flex-col items-center cursor-pointer">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Plus className="h-6 w-6 text-primary" />
            </div>
            <span className="text-sm mt-1 text-muted-foreground">Add Content</span>
          </div>
        </div>

        {sectionMenuState[section] && (
          <div className="absolute left-[calc(50%+20px)] top-0 p-2 bg-card border rounded-md shadow-md z-10 w-40">
            <ul className="space-y-1">
              <li>
                <button
                  onClick={() => {
                    addContentBlock(section, "text")
                    toggleMenu(section)
                  }}
                  className="w-full text-left px-2 py-1.5 text-sm hover:bg-muted rounded flex items-center"
                >
                  <span className="mr-2">+</span> Text Paragraph
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    addContentBlock(section, "image")
                    toggleMenu(section)
                  }}
                  className="w-full text-left px-2 py-1.5 text-sm hover:bg-muted rounded flex items-center"
                >
                  <span className="mr-2">+</span> Image
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    addContentBlock(section, "video")
                    toggleMenu(section)
                  }}
                  className="w-full text-left px-2 py-1.5 text-sm hover:bg-muted rounded flex items-center"
                >
                  <span className="mr-2">+</span> Video
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    openTableDialog(section)
                  }}
                  className="w-full text-left px-2 py-1.5 text-sm hover:bg-muted rounded flex items-center"
                >
                  <span className="mr-2">+</span> Table
                </button>
              </li>
            </ul>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex justify-between items-center mb-6 mt-20">
        <h1 className="text-3xl font-bold">Company Profile</h1>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={handlePreview}>
            <Eye className="mr-2 h-4 w-4" />
            Preview
          </Button>
          <Button variant="outline" onClick={handleSubmit}>
            <Save className="mr-2 h-4 w-4" />
            Save Draft
          </Button>
          <Button onClick={() => handlePublish()}>Publish Profile</Button>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <ScrollArea className="h-16 w-full">
            <TabsList className="w-full justify-start">
              <TabsTrigger value="company">Company</TabsTrigger>
              <TabsTrigger value="problem">Problem</TabsTrigger>
              <TabsTrigger value="solution">Solution</TabsTrigger>
              <TabsTrigger value="traction">Traction</TabsTrigger>
              <TabsTrigger value="customer">Customer</TabsTrigger>
              <TabsTrigger value="competition">Competition</TabsTrigger>
              <TabsTrigger value="goals">Strategic Goals</TabsTrigger>
              <TabsTrigger value="team">Team</TabsTrigger>
              <TabsTrigger value="partnership">Partnership</TabsTrigger>
              <TabsTrigger value="finance">Finance</TabsTrigger>
              <TabsTrigger value="attachments">Attachments</TabsTrigger>
              <TabsTrigger value="additional">Additional Info</TabsTrigger>
            </TabsList>
          </ScrollArea>

          {/* Company Information */}
          <TabsContent value="company" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Company Information</CardTitle>
                <CardDescription>Enter basic information about your company</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="companyName">Company Name</Label>
                    <Input
                      id="companyName"
                      name="companyName"
                      value={formData.companyName}
                      onChange={handleInputChange}
                      placeholder="Enter your company name"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="title">Your Title</Label>
                    <Input
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      placeholder="e.g. CEO, Founder, CTO"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="website">Company Website</Label>
                    <Input
                      id="website"
                      name="website"
                      value={formData.website}
                      onChange={handleInputChange}
                      placeholder="https://example.com"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="industry">Industry</Label>
                    <Select value={formData.industry} onValueChange={(value) => handleSelectChange("industry", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select an industry" />
                      </SelectTrigger>
                      <SelectContent>
                        {industryOptions.map((option) => (
                          <SelectItem key={option} value={option}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="moneyRaised">Money Raised (USD)</Label>
                    <Input
                      id="moneyRaised"
                      name="moneyRaised"
                      value={formData.moneyRaised}
                      onChange={handleInputChange}
                      placeholder="e.g. 1000000"
                      type="number"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="countryOfIncorporation">Country of Incorporation</Label>
                    <Input
                      id="countryOfIncorporation"
                      name="countryOfIncorporation"
                      value={formData.countryOfIncorporation}
                      onChange={handleInputChange}
                      placeholder="e.g. United States"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="oneLineDescription">1-Sentence Description</Label>
                  <Input
                    id="oneLineDescription"
                    name="oneLineDescription"
                    value={formData.oneLineDescription}
                    onChange={handleInputChange}
                    placeholder="Describe your company in one sentence"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="headquarters">Headquarters</Label>
                  <Input
                    id="headquarters"
                    name="headquarters"
                    value={formData.headquarters}
                    onChange={handleInputChange}
                    placeholder="e.g. San Francisco, CA"
                  />
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label>Introduction</Label>
                  <p className="text-sm text-muted-foreground">
                    Add paragraphs and images to describe your company's background and mission
                  </p>

                  {renderContentBlocks("introduction")}
                  {renderBlockTypeSelector("introduction")}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Problem */}
          <TabsContent value="problem" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Problem</CardTitle>
                <CardDescription>Explain the problem that your company aims to solve</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>Problem Description</Label>
                  <p className="text-sm text-muted-foreground">
                    Add paragraphs and images to explain the problem your company addresses
                  </p>

                  {renderContentBlocks("problem")}
                  {renderBlockTypeSelector("problem")}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Solution */}
          <TabsContent value="solution" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Solution</CardTitle>
                <CardDescription>Describe how your company addresses the identified problem</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>Solution Description</Label>
                  <p className="text-sm text-muted-foreground">Add paragraphs and images to describe your solution</p>

                  {renderContentBlocks("solution")}
                  {renderBlockTypeSelector("solution")}
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label>Product/Service</Label>
                  <p className="text-sm text-muted-foreground">
                    Add paragraphs and images to outline the features and benefits of your product or service
                  </p>

                  {renderContentBlocks("productService")}
                  {renderBlockTypeSelector("productService")}
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label>Business Model</Label>
                  <p className="text-sm text-muted-foreground">
                    Add paragraphs and images to explain your revenue model and how you generate income
                  </p>

                  {renderContentBlocks("businessModel")}
                  {renderBlockTypeSelector("businessModel")}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Traction */}
          <TabsContent value="traction" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Traction</CardTitle>
                <CardDescription>
                  Provide evidence of your company's growth, success, or market adoption
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>Traction Evidence</Label>
                  <p className="text-sm text-muted-foreground">
                    Add paragraphs, charts, and images to showcase your traction
                  </p>

                  {renderContentBlocks("traction")}
                  {renderBlockTypeSelector("traction")}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Customer */}
          <TabsContent value="customer" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Customer</CardTitle>
                <CardDescription>Describe your target customers and showcase testimonials</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>Target Customer</Label>
                  <p className="text-sm text-muted-foreground">
                    Add paragraphs and images to describe your ideal customer or user base
                  </p>

                  {renderContentBlocks("targetCustomer")}
                  {renderBlockTypeSelector("targetCustomer")}
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label>Testimonials</Label>
                  <p className="text-sm text-muted-foreground">
                    Add paragraphs and images to showcase customer reviews or endorsements
                  </p>

                  {renderContentBlocks("testimonials")}
                  {renderBlockTypeSelector("testimonials")}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Competition */}
          <TabsContent value="competition" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Competition</CardTitle>
                <CardDescription>Provide market insights and explain your competitive advantages</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>Market Insights</Label>
                  <p className="text-sm text-muted-foreground">
                    Add paragraphs, charts, and images to provide an overview of the market landscape
                  </p>

                  {renderContentBlocks("marketInsights")}
                  {renderBlockTypeSelector("marketInsights")}
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label>Your Competitive Advantages</Label>
                  <p className="text-sm text-muted-foreground">
                    Add paragraphs and images to explain what differentiates your company from competitors
                  </p>

                  {renderContentBlocks("competitiveAdvantages")}
                  {renderBlockTypeSelector("competitiveAdvantages")}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Strategic Goals */}
          <TabsContent value="goals" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Strategic Goals</CardTitle>
                <CardDescription>Outline your long-term vision and product roadmap</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>5-Year Vision</Label>
                  <p className="text-sm text-muted-foreground">
                    Add paragraphs and images to outline your long-term goals
                  </p>

                  {renderContentBlocks("fiveYearVision")}
                  {renderBlockTypeSelector("fiveYearVision")}
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label>Product Roadmap</Label>
                  <p className="text-sm text-muted-foreground">
                    Add paragraphs and images to detail your planned product development and milestones
                  </p>

                  {renderContentBlocks("productRoadmap")}
                  {renderBlockTypeSelector("productRoadmap")}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Team */}
          <TabsContent value="team" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Team</CardTitle>
                <CardDescription>Introduce your team members and company structure</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>CEO/Co-founder and Core Team</Label>
                  <p className="text-sm text-muted-foreground">
                    Add paragraphs and images to introduce key team members and their roles
                  </p>

                  {renderContentBlocks("team")}
                  {renderBlockTypeSelector("team")}
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label>Company Structure</Label>
                  <p className="text-sm text-muted-foreground">
                    Add paragraphs and images to explain your company's organizational structure
                  </p>

                  {renderContentBlocks("companyStructure")}
                  {renderBlockTypeSelector("companyStructure")}
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label>Organization Chart</Label>
                  <p className="text-sm text-muted-foreground">
                    Add paragraphs and images to display the hierarchical structure of your company
                  </p>

                  {renderContentBlocks("organizationChart")}
                  {renderBlockTypeSelector("organizationChart")}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Partnership */}
          <TabsContent value="partnership" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Partnership</CardTitle>
                <CardDescription>List your strategic partners</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>Key Partners</Label>
                  <p className="text-sm text-muted-foreground">
                    Add paragraphs and images to list your strategic partners
                  </p>

                  {renderContentBlocks("keyPartners")}
                  {renderBlockTypeSelector("keyPartners")}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Finance */}
          <TabsContent value="finance" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Finance</CardTitle>
                <CardDescription>Provide details about your fundraising and financial projections</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="fundingMethod">Funding Method</Label>
                    <Select
                      value={formData.fundingMethod}
                      onValueChange={(value) => handleSelectChange("fundingMethod", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select funding method" />
                      </SelectTrigger>
                      <SelectContent>
                        {fundingMethodOptions.map((option) => (
                          <SelectItem key={option} value={option}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="round">Round</Label>
                    <Select value={formData.round} onValueChange={(value) => handleSelectChange("round", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select round" />
                      </SelectTrigger>
                      <SelectContent>
                        {roundOptions.map((option) => (
                          <SelectItem key={option} value={option}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="instrument">Instrument</Label>
                    <Select
                      value={formData.instrument}
                      onValueChange={(value) => handleSelectChange("instrument", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select instrument" />
                      </SelectTrigger>
                      <SelectContent>
                        {instrumentOptions.map((option) => (
                          <SelectItem key={option} value={option}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="valuation">Valuation (USD)</Label>
                    <Input
                      id="valuation"
                      name="valuation"
                      value={formData.valuation}
                      onChange={handleInputChange}
                      placeholder="e.g. 10000000"
                      type="number"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="fundingAmount">Funding Amount (USD)</Label>
                    <Input
                      id="fundingAmount"
                      name="fundingAmount"
                      value={formData.fundingAmount}
                      onChange={handleInputChange}
                      placeholder="e.g. 1000000"
                      type="number"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="minimumTicket">Minimum Ticket (USD)</Label>
                    <Input
                      id="minimumTicket"
                      name="minimumTicket"
                      value={formData.minimumTicket}
                      onChange={handleInputChange}
                      placeholder="e.g. 10000"
                      type="number"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="deadline">Deadline</Label>
                    <DatePicker value={formData.deadline} onChange={(date) => handleSelectChange("deadline", date)} />
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label>Use of Fund</Label>
                  <p className="text-sm text-muted-foreground">
                    Add paragraphs and images to explain how the raised funds will be utilized
                  </p>

                  {renderContentBlocks("useOfFund")}
                  {renderBlockTypeSelector("useOfFund")}
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label>Investment Summary</Label>
                  <p className="text-sm text-muted-foreground">
                    Add paragraphs and images to describe previous investments and financial history
                  </p>

                  {renderContentBlocks("investmentSummary")}
                  {renderBlockTypeSelector("investmentSummary")}
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label>5-Year Projections</Label>
                  <p className="text-sm text-muted-foreground">
                    Add paragraphs, charts, and tables to outline financial projections for the next five years
                  </p>

                  {renderContentBlocks("fiveYearProjections")}
                  {renderBlockTypeSelector("fiveYearProjections")}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Attachments */}
          <TabsContent value="attachments" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Attachments</CardTitle>
                <CardDescription>Upload your pitch deck, NDA, and other documents</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>Pitch Deck</Label>
                  <FileUploader
                    onFileUpload={(file) => handleFileUpload("pitchDeck", file)}
                    acceptedFileTypes=".pdf,.pptx,.ppt"
                    maxFileSize={10}
                  />
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label>NDA (Non-Disclosure Agreement)</Label>
                  <FileUploader
                    onFileUpload={(file) => handleFileUpload("nda", file)}
                    acceptedFileTypes=".pdf,.docx,.doc"
                    maxFileSize={5}
                  />
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label>Other Documents</Label>
                  <p className="text-sm text-muted-foreground">
                    Upload additional legal or investment-related documents (e.g., Subscription Agreement, LPA, PPM)
                  </p>
                  <FileUploader
                    onFileUpload={(file) => {
                      setFormData((prev) => ({
                        ...prev,
                        otherDocuments: [...(prev.otherDocuments as any[]), file],
                      }))
                    }}
                    acceptedFileTypes=".pdf,.docx,.doc,.xlsx,.xls"
                    maxFileSize={10}
                    multiple
                  />

                  {/* List of uploaded documents */}
                  {(formData.otherDocuments as any[]).length > 0 && (
                    <div className="mt-4 space-y-2">
                      <Label>Uploaded Documents</Label>
                      <div className="border rounded-md divide-y">
                        {(formData.otherDocuments as any[]).map((doc, index) => (
                          <div key={index} className="flex items-center justify-between p-3">
                            <div className="flex items-center">
                              <FileText className="h-5 w-5 mr-2 text-muted-foreground" />
                              <span>{doc.name}</span>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setFormData((prev) => ({
                                  ...prev,
                                  otherDocuments: (prev.otherDocuments as any[]).filter((_, i) => i !== index),
                                }))
                              }}
                            >
                              <Trash className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Additional Information */}
          <TabsContent value="additional" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Additional Information</CardTitle>
                <CardDescription>Provide any additional information about your fundraising</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="raiseStructure">How Would You Like to Structure Your Raise?</Label>
                  <Textarea
                    id="raiseStructure"
                    name="raiseStructure"
                    value={formData.raiseStructure}
                    onChange={handleInputChange}
                    placeholder="Describe your preferred structure for fundraising"
                    rows={5}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end mt-6 space-x-2">
          <Button variant="outline" type="button" onClick={() => (window.location.href = "/admin/dashboard")}>
            Cancel
          </Button>
          <Button type="submit">
            <Save className="mr-2 h-4 w-4" />
            Save Profile
          </Button>
        </div>
      </form>

      {/* Publish Validation Dialog */}
      <Dialog open={showPublishDialog} onOpenChange={setShowPublishDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cannot Publish Profile</DialogTitle>
            <DialogDescription>Please complete the following required information before publishing:</DialogDescription>
          </DialogHeader>

          <Alert variant="destructive" className="mt-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Required Fields Missing</AlertTitle>
            <AlertDescription>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                {publishErrors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>

          <DialogFooter>
            <Button onClick={() => setShowPublishDialog(false)}>OK, I'll Complete It</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Table Creation Dialog */}
      <Dialog open={showTableDialog} onOpenChange={setShowTableDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Table</DialogTitle>
            <DialogDescription>Specify the dimensions for your table</DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="rows">Rows</Label>
                <Input
                  id="rows"
                  type="number"
                  min="1"
                  max="20"
                  value={tableRows}
                  onChange={(e) => setTableRows(Number.parseInt(e.target.value) || 1)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="columns">Columns</Label>
                <Input
                  id="columns"
                  type="number"
                  min="1"
                  max="10"
                  value={tableColumns}
                  onChange={(e) => setTableColumns(Number.parseInt(e.target.value) || 1)}
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowTableDialog(false)}>
              Cancel
            </Button>
            <Button onClick={() => addTableBlock(tableSection, tableRows, tableColumns)}>Create Table</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Content Block Editor Modal */}
      {showBlockEditor && editingBlock && (
        <ContentBlockEditor
          block={editingBlock.block}
          onSave={(updatedBlock) => saveContentBlock(editingBlock.section, updatedBlock)}
          onCancel={() => {
            setShowBlockEditor(false)
            setEditingBlock(null)
          }}
        />
      )}
    </div>
  )
}
