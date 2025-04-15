"use client"

import { useState } from "react"
import Image from "next/image"

interface ContentBlockProps {
  block: {
    id: string
    type: string
    content: string
    caption?: string
    url?: string
    data?: any[]
  }
}

export function ContentBlock({ block }: ContentBlockProps) {
  const [imageError, setImageError] = useState(false)

  // Render based on block type
  switch (block.type) {
    case "text":
      return (
        <div className="prose prose-sm max-w-none dark:prose-invert">
          <div dangerouslySetInnerHTML={{ __html: block.content }} />
        </div>
      )

    case "image":
      return (
        <div className="space-y-2">
          <div className="relative w-full rounded-md overflow-hidden" style={{ paddingBottom: "56.25%" }}>
            {!imageError ? (
              <Image
                src={block.url || "/placeholder.svg?height=9&width=16"}
                alt={block.caption || "Image"}
                fill
                className="object-contain"
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <p className="text-muted-foreground">Failed to load image</p>
              </div>
            )}
          </div>
          {block.caption && <p className="text-sm text-center text-muted-foreground">{block.caption}</p>}
        </div>
      )

    case "video":
      return (
        <div className="space-y-2">
          <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
            <iframe src={block.url} className="absolute top-0 left-0 w-full h-full rounded-md" allowFullScreen></iframe>
          </div>
          {block.caption && <p className="text-sm text-center text-muted-foreground">{block.caption}</p>}
        </div>
      )

    case "table":
      return (
        <div className="space-y-2">
          <div className="border rounded-md overflow-hidden">
            <table className="w-full">
              <thead className="bg-muted">
                <tr>
                  <th className="p-2 text-left">Column 1</th>
                  <th className="p-2 text-left">Column 2</th>
                  <th className="p-2 text-left">Column 3</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="p-2 border-t">Data 1</td>
                  <td className="p-2 border-t">Data 2</td>
                  <td className="p-2 border-t">Data 3</td>
                </tr>
                <tr>
                  <td className="p-2 border-t">Data 4</td>
                  <td className="p-2 border-t">Data 5</td>
                  <td className="p-2 border-t">Data 6</td>
                </tr>
              </tbody>
            </table>
          </div>
          {block.caption && <p className="text-sm text-center text-muted-foreground">{block.caption}</p>}
        </div>
      )

    default:
      return <div>Unknown block type</div>
  }
}
