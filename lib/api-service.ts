// API Service for fetching data from the backend

type InvestorDataResponse = {
  data: {
    id: number
    user_id: string
    first_name: string
    last_name: string
    email: string
    phone: string
    kyc_status: string
    payment_status: string
    payment_plan: string
    installments_remaining: number
    total_installments: number
    tokens_purchased: number
    token_value: number
    token_price: number
    investment_amount: number
    amount_invested: number
    status: string
    investment_date: string
    agreement_url: string
    documents: Array<{
      id: number
      name: string
      type: string
      url: string
      status: string
      date: string
    }>
  }
}

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL
/**
 * Fetches investor details including documents and investment information
 * @param investorId - The ID of the investor (either user_id or investor_id)
 * @param isUserId - Whether the provided ID is a user_id (true) or investor_id (false)
 * @returns Promise with investor data or error
 */
export async function fetchInvestorData(investorId: string | number, isUserId = false): Promise<InvestorDataResponse> {
  try {
    const queryParam = isUserId ? "?user_query=true" : ""
    const response = await fetch(`${API_URL}/investors/${investorId}${queryParam}`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Failed to fetch investor data: ${response.status} ${errorText}`)
    }

    return await response.json()
  } catch (error: any) {
    console.error("Error fetching investor data:", error)
    throw error
  }
}

/**
 * Fetches all documents for an investor
 * @param investorId - The ID of the investor
 * @returns Promise with document data or error
 */
export async function fetchInvestorDocuments(investorId: string | number): Promise<any> {
  try {
    const response = await fetch(`${API_URL}/tos/documents?investor_id=${investorId}`, {
      method: "GET",
      credentials: "include",
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Failed to fetch investor documents: ${response.status} ${errorText}`)
    }

    return await response.json()
  } catch (error: any) {
    console.error("Error fetching investor documents:", error)
    throw error
  }
}

/**
 * Maps the backend payment_plan value to the frontend format
 * @param paymentPlan - The payment plan from the API (e.g., "FULL", "INSTALLMENT")
 * @returns The formatted payment plan for frontend ("full" or "installment")
 */
export function mapPaymentPlan(paymentPlan: string): "full" | "installment" {
  return paymentPlan && paymentPlan.toLowerCase() === "full" ? "full" : "installment"
}

/**
 * Maps the backend document type to a frontend format
 * @param docType - The document type from the API
 * @returns The document type for frontend
 */
export function mapDocumentType(docType: string): string {
  const typeMap: Record<string, string> = {
    SAFE: "legal",
    NDA: "legal",
    PAYMENT: "payment",
    ID: "identity",
    ADDRESS: "identity",
  }

  return typeMap[docType] || "other"
}

/**
 * Maps the backend document status to a frontend format
 * @param status - The document status from the API
 * @returns The document status for frontend
 */
export function mapDocumentStatus(status: string): string {
  const statusMap: Record<string, string> = {
    GENERATED: "available",
    COMPLETED: "signed",
    APPROVED: "approved",
    VERIFIED: "verified",
    PENDING: "pending",
    REJECTED: "rejected",
  }

  return statusMap[status] || "available"
}

/**
 * Converts an ISO date string to a user-friendly format
 * @param isoDate - The ISO date string
 * @returns Formatted date string (e.g., "March 21, 2025")
 */
export function formatDate(isoDate: string): string {
  if (!isoDate) return ""

  try {
    const date = new Date(isoDate)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  } catch (error) {
    console.error("Error formatting date:", error)
    return isoDate
  }
}

/**
 * Maps the backend onboarding status to the frontend format
 * @param kycStatus - The KYC status from the API
 * @returns The formatted KYC status for frontend
 */
export function mapKycStatus(kycStatus: string): "not_submitted" | "submitted" | "rejected" {
  const statusMap: Record<string, "not_submitted" | "submitted" | "rejected"> = {
    PENDING: "submitted",
    VERIFIED: "submitted",
    REJECTED: "rejected",
  }

  return statusMap[kycStatus] || "not_submitted"
}

/**
 * Maps the backend contract status to the frontend format
 * @param contractStatus - The contract status from the API
 * @returns The formatted contract status for frontend
 */
export function mapContractStatus(contractStatus: string): "not_signed" | "signed" {
  return contractStatus === "COMPLETED" ? "signed" : "not_signed"
}

/**
 * Updates the investor's payment option and investment amount in the database
 * @param userId - The user ID
 * @param paymentOption - The selected payment option ("full" or "installment")
 * @param investmentAmount - The investment amount in SGD
 * @param investorId - Optional investor ID. If not provided, will use userId as a query parameter
 * @returns Promise with success response or error
 */
export async function updateInvestorPaymentOption(
  userId: string | number,
  paymentOption: "full" | "installment",
  investmentAmount: number,
  investorId?: number,
): Promise<any> {
  try {
    // If investor ID is provided, use it directly, otherwise use userId as a parameter
    const url = investorId
      ? `${API_URL}/investors/${investorId}/update-payment`
      : `${API_URL}/investors/${userId}/update-payment?user_query=true`

    const response = await fetch(url, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        payment_plan: paymentOption.toUpperCase(),
        investment_amount: investmentAmount,
        total_installments: paymentOption === "installment" ? 12 : 1,
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Failed to update payment option: ${response.status} ${errorText}`)
    }

    return await response.json()
  } catch (error: any) {
    console.error("Error updating payment option:", error)
    throw error
  }
}
