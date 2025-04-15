"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ContentBlock } from "./content-block"

interface ContentBlockEditorProps {
  block: {
    id: string
    type: string
    content: string
    caption?: string
    url?: string
    data?: any[]
  }
  onSave: (updatedBlock: any) => void
  onCancel: () => void
}

export function ContentBlockEditor({ block, onSave, onCancel }: ContentBlockEditorProps) {
  const [editedBlock, setEditedBlock] = useState({ ...block })
  const [activeTab, setActiveTab] = useState("edit")

  // Update content
  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEditedBlock({ ...editedBlock, content: e.target.value })
  }

  // Update caption
  const handleCaptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedBlock({ ...editedBlock, caption: e.target.value })
  }

  // Update URL
  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedBlock({ ...editedBlock, url: e.target.value })
  }

  // Render editor based on block type
  const renderEditor = () => {
    switch (editedBlock.type) {
      case "text":
        return (
          <div className="space-y-2">
            <Label htmlFor="content">Content</Label>
            <Textarea
              id="content"
              value={editedBlock.content}
              onChange={handleContentChange}
              rows={10}
              className="font-mono"
            />
            <p className="text-xs text-muted-foreground">
              You can use HTML tags for formatting (e.g., &lt;b&gt;bold&lt;/b&gt;, &lt;i&gt;italic&lt;/i&gt;,
              &lt;ul&gt;&lt;li&gt;list item&lt;/li&gt;&lt;/ul&gt;)
            </p>
          </div>
        )

      case "image":
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="url">Image URL</Label>
              <Input
                id="url"
                value={editedBlock.url}
                onChange={handleUrlChange}
                placeholder="https://example.com/image.jpg"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="caption">Caption</Label>
              <Input
                id="caption"
                value={editedBlock.caption}
                onChange={handleCaptionChange}
                placeholder="Image caption"
              />
            </div>
          </div>
        )

      case "video":
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="url">Video Embed URL</Label>
              <Input
                id="url"
                value={editedBlock.url}
                onChange={handleUrlChange}
                placeholder="https://www.youtube.com/embed/VIDEO_ID"
              />
              <p className="text-xs text-muted-foreground">
                Use the embed URL format (e.g., https://www.youtube.com/embed/dQw4w9WgXcQ)
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="caption">Caption</Label>
              <Input
                id="caption"
                value={editedBlock.caption}
                onChange={handleCaptionChange}
                placeholder="Video caption"
              />
            </div>
          </div>
        )

      case "chart":
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Chart Data</Label>
              <p className="text-sm text-muted-foreground">
                Chart editor is not available in this preview. In a full implementation, this would include a chart data
                editor.
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="caption">Caption</Label>
              <Input
                id="caption"
                value={editedBlock.caption}
                onChange={handleCaptionChange}
                placeholder="Chart caption"
              />
            </div>
          </div>
        )

      case "table":
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Table Data</Label>
              <p className="text-sm text-muted-foreground">
                Table editor is not available in this preview. In a full implementation, this would include a table data
                editor.
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="caption">Caption</Label>
              <Input
                id="caption"
                value={editedBlock.caption}
                onChange={handleCaptionChange}
                placeholder="Table caption"
              />
            </div>
          </div>
        )

      default:
        return <div>Unknown block type</div>
    }
  }

  return (
    <Dialog open={true} onOpenChange={() => onCancel()}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit {block.type.charAt(0).toUpperCase() + block.type.slice(1)} Block</DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="edit">Edit</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
          </TabsList>

          <TabsContent value="edit" className="space-y-4 py-4">
            {renderEditor()}
          </TabsContent>

          <TabsContent value="preview" className="py-4">
            <div className="border rounded-md p-4">
              <ContentBlock block={editedBlock} />
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button onClick={() => onSave(editedBlock)}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
