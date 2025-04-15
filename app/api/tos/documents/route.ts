import { type NextRequest, NextResponse } from "next/server"

// Configure the backend API URL - adjust this to match your Flask server
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

// Proxy GET requests to the Flask backend's TOS documents endpoint
export async function GET(request: NextRequest) {
  try {
    // Get URL search params from the request
    const url = new URL(request.url)
    const queryParams = url.searchParams.toString()
    const queryString = queryParams ? `?${queryParams}` : ""

    // Try multiple possible URLs since we don't know exactly how the Flask blueprint is registered
    const possibleEndpoints = [
      `${API_BASE_URL}/tos/documents${queryString}`, // If registered with url_prefix='/tos'
      `${API_BASE_URL}/api/tos/documents${queryString}`, // If registered with url_prefix='/api/tos'
      `${API_BASE_URL}/documents${queryString}`, // If registered without a prefix
      `${API_BASE_URL}/api/documents${queryString}`, // If registered with url_prefix='/api'
    ]

    let responseData: any = null
    let errorData: any = null
    let foundWorkingEndpoint = false

    // Try each endpoint until we get a successful response
    for (const endpoint of possibleEndpoints) {
      console.log(`Trying to fetch documents from: ${endpoint}`)

      try {
        const response = await fetch(endpoint, {
          headers: {
            "Content-Type": "application/json",
            // Pass any auth headers if needed
            ...(request.headers.get("Authorization") ? { Authorization: request.headers.get("Authorization")! } : {}),
          },
          cache: "no-store",
        })

        if (response.ok) {
          console.log(`Successfully fetched documents from: ${endpoint}`)
          responseData = await response.json()
          foundWorkingEndpoint = true
          break
        } else {
          console.log(`Failed to fetch from ${endpoint}: ${response.status}`)
          errorData = await response.json().catch(() => ({ error: `HTTP error ${response.status}` }))
        }
      } catch (e) {
        console.log(`Error fetching from ${endpoint}:`, e)
      }
    }

    // If no successful response, return an error or mock data
    if (!foundWorkingEndpoint) {
      // If we couldn't connect to the backend, return mock data for development
      if (process.env.NODE_ENV === "development") {
        console.log("Using mock data for development")
        return NextResponse.json([
          {
            id: "1",
            name: "Sample Document 1",
            type: "document",
            category: "investor",
            description: "This is a mock document",
            uploadDate: new Date().toISOString().split("T")[0],
            status: "published",
            version: "1.0",
            size: "2.5 MB",
            url: "#",
            downloadUrl: "#",
            viewUrl: "#",
          },
          {
            id: "2",
            name: "Sample Presentation",
            type: "presentation",
            category: "investor",
            description: "This is a mock presentation",
            uploadDate: new Date().toISOString().split("T")[0],
            status: "published",
            version: "1.0",
            size: "4.2 MB",
            url: "#",
            downloadUrl: "#",
            viewUrl: "#",
          },
        ])
      }

      // In production, return the actual error
      return NextResponse.json(errorData || { error: "Failed to fetch documents from backend" }, { status: 500 })
    }

    // Return the successful response
    return NextResponse.json(responseData)
  } catch (error) {
    console.error("Error fetching documents:", error)

    // Return a more detailed error
    return NextResponse.json(
      {
        error: "Failed to fetch documents",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
