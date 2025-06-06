"use server"

/**
 * API client for investors management
 * This file contains the functions to interact with the backend API
 */

// Ensure this is set in your Vercel environment variables
console.log("Environment variables check:", {
  API_BASE_URL_ENV: process.env.NEXT_PUBLIC_API_BASE_URL,
  NODE_ENV: process.env.NODE_ENV,
})

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:4242"
console.log("Using API base URL:", API_BASE_URL)

// Convert snake_case to camelCase
function toCamelCase(data: any): any {
  if (data === null || data === undefined || typeof data !== "object") {
    return data
  }

  if (Array.isArray(data)) {
    return data.map((item) => toCamelCase(item))
  }

  return Object.keys(data).reduce(
    (acc, key) => {
      // Convert key from snake_case to camelCase
      const camelKey = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase())

      // Special handling for test_onboarding_status if it's a JSON string
      if (key === "test_onboarding_status") {
        // Keep the original field value - don't recursively process JSON strings
        acc[camelKey] = data[key]
        return acc
      }

      // Convert value recursively if it's an object or array
      const value = data[key]
      acc[camelKey] = toCamelCase(value)

      return acc
    },
    {} as Record<string, any>,
  )
}

// Helper function for API calls with error handling
async function apiFetch(endpoint: string, options: RequestInit = {}) {
  const url = `${API_BASE_URL}${endpoint}`
  console.log(`Fetching from: ${url}`, options)

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        // Add any other required headers like Authorization if needed
        ...options.headers,
      },
      // For Next.js App Router, needed for server actions
      cache: "no-store",
      // Add mode: 'cors' to explicitly use CORS
      mode: "cors",
    })

    // Log the response status for debugging
    console.log(`Response status: ${response.status} for ${url}`)

    if (!response.ok) {
      const errorText = await response.text() // Get error text first
      let errorData
      try {
        errorData = JSON.parse(errorText) // Then try to parse as JSON
      } catch (e) {
        errorData = { error: errorText || `HTTP error! status: ${response.status}` }
      }
      console.error("API Error Response:", errorData)
      return { data: null, error: errorData.error || `HTTP error! status: ${response.status}` }
    }

    const data = await response.json()

    // Handle JSON array response (common for GET collections)
    if (Array.isArray(data)) {
      console.log("Response is an array with", data.length, "items")
      return {
        data: toCamelCase(data),
        error: null,
        total: data.length,
        page: 1,
        limit: data.length,
        totalPages: 1,
      }
    }

    // Handle standard response object
    return {
      data: data.data ? toCamelCase(data.data) : null,
      error: null,
      total: data.total,
      page: data.page,
      limit: data.limit,
      totalPages: data.total_pages,
    }
  } catch (error) {
    console.error("Fetch API Error:", error)
    let errorMessage = "An unknown network error occurred"
    if (error instanceof Error) {
      errorMessage = error.message
    }
    // Add more debug info to the error message
    return {
      data: null,
      error: `${errorMessage} - while fetching ${url}. This could be a CORS issue or the server might not be running.`,
    }
  }
}

/**
 * Fetch list of investors
 * @param searchQuery Search query for filtering
 * @param page Page number
 * @param limit Items per page
 */
export async function fetchInvestors(searchQuery = "", page = 1, limit = 10) {
  const endpoint = `/investors?search=${encodeURIComponent(searchQuery)}&page=${page}&limit=${limit}`
  return apiFetch(endpoint)
}

/**
 * Fetch details for a specific investor
 * @param investorId ID of the investor
 */
export async function fetchInvestorDetails(investorId: number | string) {
  if (!investorId) {
    return { data: null, error: "Investor ID is required" }
  }
  const endpoint = `/investors/${investorId}`
  return apiFetch(endpoint)
}

/**
 * Approve KYC for an investor
 * @param investorId ID of the investor
 */
export async function approveInvestorKYC(investorId: number | string) {
  if (!investorId) {
    return { data: null, error: "Investor ID is required" }
  }
  const endpoint = `/investors/${investorId}/approve-kyc`
  return apiFetch(endpoint, { method: "POST" })
}

/**
 * Reject KYC for an investor
 * @param investorId ID of the investor
 * @param reason Reason for rejection
 */
export async function rejectInvestorKYC(investorId: number | string, reason: string) {
  if (!investorId) {
    return { data: null, error: "Investor ID is required" }
  }
  if (!reason) {
    return { data: null, error: "Rejection reason is required" }
  }
  const endpoint = `/investors/${investorId}/reject-kyc`
  return apiFetch(endpoint, {
    method: "POST",
    body: JSON.stringify({ reason }),
  })
}

/**
 * Approve payment for an investor
 * @param investorId ID of the investor
 */
export async function approveInvestorPayment(investorId: number | string) {
  if (!investorId) {
    return { data: null, error: "Investor ID is required" }
  }
  const endpoint = `/investors/${investorId}/approve-payment`
  return apiFetch(endpoint, { method: "POST" })
}

/**
 * Reject payment for an investor
 * @param investorId ID of the investor
 * @param reason Reason for rejection
 */
export async function rejectInvestorPayment(investorId: number | string, reason: string) {
  if (!investorId) {
    return { data: null, error: "Investor ID is required" }
  }
  if (!reason) {
    return { data: null, error: "Rejection reason is required" }
  }
  const endpoint = `/investors/${investorId}/reject-payment`
  return apiFetch(endpoint, {
    method: "POST",
    body: JSON.stringify({ reason }),
  })
}

/**
 * Export investors data
 * This is a placeholder for when you implement the export functionality
 */
export async function exportInvestors() {
  const endpoint = `/investors/export`
  return apiFetch(endpoint)
}

/**
 * Fetch documents for a specific investor
 * @param investorId ID of the investor
 */
export async function fetchInvestorDocuments(investorId: number | string) {
  if (!investorId) {
    return { documents: [], error: "Investor ID is required" }
  }
  const endpoint = `/tos/documents?investor_id=${investorId}`
  console.log(`Fetching documents for investor ${investorId}`)
  const response = await apiFetch(endpoint)

  // Check if response.data is an array (documents returned directly)
  if (Array.isArray(response.data)) {
    return {
      documents: response.data,
      error: null,
    }
  }

  // Handle both direct array response and nested data response
  return {
    documents: Array.isArray(response.data) ? response.data : response.data || [],
    error: response.error,
  }
}
