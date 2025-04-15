import { type NextRequest, NextResponse } from "next/server"

// Configure the backend API URL - adjust this to match your Flask server
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

// Proxy POST requests to the Flask backend for document uploads
export async function POST(request: NextRequest) {
  try {
    // Extract the form data from the request
    const formData = await request.formData()

    // Log the form data for debugging
    console.log("Received upload request with form data:")
    for (const [key, value] of formData.entries()) {
      console.log(`${key}: ${value instanceof File ? `File (${value.name}, ${value.size} bytes)` : value}`)
    }

    // Try multiple possible endpoints
    const possibleEndpoints = [
      `${API_BASE_URL}/tos/upload`,
      `${API_BASE_URL}/api/tos/upload`,
      `${API_BASE_URL}/upload`,
      `${API_BASE_URL}/api/upload`,
    ]

    let responseData: any = null
    let errorData: any = null
    let foundWorkingEndpoint = false

    // Try each endpoint until we get a successful response
    for (const endpoint of possibleEndpoints) {
      console.log(`Trying to upload to: ${endpoint}`)

      try {
        // Forward the form data to the backend
        const response = await fetch(endpoint, {
          method: "POST",
          body: formData,
        })

        if (response.ok) {
          console.log(`Successfully uploaded to: ${endpoint}`)
          responseData = await response.json()
          foundWorkingEndpoint = true
          break
        } else {
          console.log(`Failed to upload to ${endpoint}: ${response.status}`)
          errorData = await response.json().catch(() => ({ error: `HTTP error ${response.status}` }))
        }
      } catch (e) {
        console.log(`Error uploading to ${endpoint}:`, e)
      }
    }

    // If no successful response, return an error
    if (!foundWorkingEndpoint) {
      return NextResponse.json(errorData || { error: "Failed to upload file to backend" }, { status: 500 })
    }

    // Return the successful response
    return NextResponse.json(responseData)
  } catch (error) {
    console.error("Error processing upload:", error)

    // Return a more detailed error
    return NextResponse.json(
      {
        error: "Failed to process upload",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
