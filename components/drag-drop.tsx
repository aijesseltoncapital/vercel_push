"use client"

// This is a simplified mock implementation of react-beautiful-dnd
// In a real application, you would use the actual library

import type React from "react"

// DragDropContext
export const DragDropContext = ({
  children,
  onDragEnd,
}: {
  children: React.ReactNode
  onDragEnd: (result: any) => void
}) => {
  return <div className="drag-drop-context">{children}</div>
}

// Droppable
export const Droppable = ({
  children,
  droppableId,
}: {
  children: (provided: any) => React.ReactNode
  droppableId: string
}) => {
  const provided = {
    innerRef: (ref: any) => {},
    droppableProps: {
      "data-droppable-id": droppableId,
    },
    placeholder: <div className="h-0"></div>,
  }

  return children(provided)
}

// Draggable
export const Draggable = ({
  children,
  draggableId,
  index,
}: {
  children: (provided: any) => React.ReactNode
  draggableId: string
  index: number
}) => {
  const provided = {
    innerRef: (ref: any) => {},
    draggableProps: {
      "data-draggable-id": draggableId,
      "data-index": index,
      style: {
        transition: "transform 0.2s",
      },
    },
    dragHandleProps: {
      "data-drag-handle": true,
      style: {
        cursor: "grab",
      },
    },
  }

  return children(provided)
}
