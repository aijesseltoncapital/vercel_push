// File: investment-platform/app/api/investors/[id]/generate-agreement/route.ts

import { NextResponse } from "next/server"

export async function POST(request: Request, context: any) {
  try {
    const params = await context.params
    const investorId = params.id
    const body = await request.json()

    // Get API URL from environment variables or use default
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL

    // Call the backend API to generate the agreement
    const response = await fetch(`${apiBaseUrl}/investors/${investorId}/generate-agreement`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })

    // Get response data
    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || "Failed to generate agreement")
    }

    // Return the response
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error generating agreement:", error)
    return NextResponse.json({ error: "Failed to generate agreement" }, { status: 500 })
  }
}
