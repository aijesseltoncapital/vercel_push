"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
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
  DialogTrigger,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Search, Download, FileText, CheckCircle, XCircle, Upload, Eye, CreditCard, AlertCircle } from "lucide-react"

export default function InvestorsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedInvestor, setSelectedInvestor] = useState<any>(null)
  const ITEMS_PER_PAGE = 10
  const [currentPage, setCurrentPage] = useState(1)
  const [scrollPosition, setScrollPosition] = useState(0)
  const tableRef = useRef<HTMLDivElement>(null)

  const [paymentApprovalOpen, setPaymentApprovalOpen] = useState(false)
  const [documentPreviewOpen, setDocumentPreviewOpen] = useState(false)
  const [selectedDocument, setSelectedDocument] = useState<any>(null)
  const [rejectionReason, setRejectionReason] = useState("")
  const { toast } = useToast()

  // Mock data for investors with various statuses and scenarios
  const investors = [
    {
      id: 1,
      name: "John Doe",
      email: "john.doe@example.com",
      phone: "+1 (555) 123-4567",
      dateOfBirth: "1985-06-15",
      address: "123 Main St, City, Country",
      investmentAmount: 50000,
      status: "VERIFIED",
      paymentStatus: "COMPLETED",
      kycStatus: "VERIFIED",
      createdAt: "2023-05-10",
      paymentPlan: "INSTALLMENT",
      remainingPayments: 8,
      documents: [
        {
          id: 1,
          name: "Driver's License",
          type: "ID",
          status: "VERIFIED",
          date: "2023-05-09",
          url: "/placeholder.svg?height=600&width=800",
        },
        {
          id: 2,
          name: "Proof of Address",
          type: "ADDRESS",
          status: "VERIFIED",
          date: "2023-05-09",
          url: "/placeholder.svg?height=600&width=800",
        },
        {
          id: 3,
          name: "SAFE Agreement",
          type: "AGREEMENT",
          status: "SIGNED",
          date: "2023-05-10",
          url: "/placeholder.svg?height=600&width=800",
        },
        {
          id: 4,
          name: "Bank Transfer Receipt",
          type: "PAYMENT",
          status: "APPROVED",
          date: "2023-05-11",
          url: "/placeholder.svg?height=600&width=800",
        },
      ],
    },
    {
      id: 2,
      name: "Jane Smith",
      email: "jane.smith@example.com",
      phone: "+1 (555) 987-6543",
      dateOfBirth: "1990-03-22",
      address: "456 Oak Ave, Town, Country",
      investmentAmount: 75000,
      status: "PENDING",
      paymentStatus: "SAFE_UNSIGNED",
      kycStatus: "VERIFIED",
      createdAt: "2023-05-12",
      documents: [
        {
          id: 5,
          name: "Passport",
          type: "ID",
          status: "VERIFIED",
          date: "2023-05-12",
          url: "/placeholder.svg?height=600&width=800",
        },
        {
          id: 6,
          name: "Utility Bill",
          type: "ADDRESS",
          status: "VERIFIED",
          date: "2023-05-12",
          url: "/placeholder.svg?height=600&width=800",
        },
        {
          id: 7,
          name: "SAFE Agreement",
          type: "AGREEMENT",
          status: "UNSIGNED",
          date: "2023-05-12",
          url: "/placeholder.svg?height=600&width=800",
        },
      ],
    },
    {
      id: 3,
      name: "Robert Johnson",
      email: "robert.johnson@example.com",
      phone: "+1 (555) 456-7890",
      dateOfBirth: "1978-11-30",
      address: "789 Pine St, Village, Country",
      investmentAmount: 25000,
      status: "VERIFIED",
      paymentStatus: "PENDING_APPROVAL",
      kycStatus: "VERIFIED",
      createdAt: "2023-05-14",
      documents: [
        {
          id: 7,
          name: "Driver's License",
          type: "ID",
          status: "VERIFIED",
          date: "2023-05-13",
          url: "/placeholder.svg?height=600&width=800",
        },
        {
          id: 8,
          name: "Bank Statement",
          type: "ADDRESS",
          status: "VERIFIED",
          date: "2023-05-13",
          url: "/placeholder.svg?height=600&width=800",
        },
        {
          id: 9,
          name: "SAFE Agreement",
          type: "AGREEMENT",
          status: "SIGNED",
          date: "2023-05-14",
          url: "/placeholder.svg?height=600&width=800",
        },
        {
          id: 10,
          name: "Bank Transfer Receipt",
          type: "PAYMENT",
          status: "PENDING_APPROVAL",
          date: "2023-05-14",
          url: "/placeholder.svg?height=600&width=800",
        },
      ],
    },
    {
      id: 4,
      name: "Emily Davis",
      email: "emily.davis@example.com",
      phone: "+1 (555) 234-5678",
      dateOfBirth: "1982-07-18",
      address: "101 Maple Dr, City, Country",
      investmentAmount: 100000,
      status: "VERIFIED",
      paymentStatus: "COMPLETED",
      kycStatus: "VERIFIED",
      createdAt: "2023-05-08",
      paymentPlan: "INSTALLMENT",
      remainingPayments: 2,
      documents: [
        {
          id: 11,
          name: "Passport",
          type: "ID",
          status: "VERIFIED",
          date: "2023-05-07",
          url: "/placeholder.svg?height=600&width=800",
        },
        {
          id: 12,
          name: "Utility Bill",
          type: "ADDRESS",
          status: "VERIFIED",
          date: "2023-05-07",
          url: "/placeholder.svg?height=600&width=800",
        },
        {
          id: 13,
          name: "SAFE Agreement",
          type: "AGREEMENT",
          status: "SIGNED",
          date: "2023-05-08",
          url: "/placeholder.svg?height=600&width=800",
        },
        {
          id: 14,
          name: "Credit Card Payment",
          type: "PAYMENT",
          status: "COMPLETED",
          date: "2023-05-08",
          url: "/placeholder.svg?height=600&width=800",
        },
      ],
    },
    {
      id: 5,
      name: "Michael Wilson",
      email: "michael.wilson@example.com",
      phone: "+1 (555) 876-5432",
      dateOfBirth: "1995-02-10",
      address: "202 Elm St, Town, Country",
      investmentAmount: 0,
      status: "REJECTED",
      paymentStatus: "NOT_STARTED",
      kycStatus: "REJECTED",
      createdAt: "2023-05-15",
      documents: [
        {
          id: 15,
          name: "ID Card",
          type: "ID",
          status: "REJECTED",
          date: "2023-05-15",
          url: "/placeholder.svg?height=600&width=800",
        },
        {
          id: 16,
          name: "Proof of Address",
          type: "ADDRESS",
          status: "REJECTED",
          date: "2023-05-15",
          url: "/placeholder.svg?height=600&width=800",
        },
      ],
      rejectionReason: "Documents appear to be altered or manipulated.",
    },
    {
      id: 6,
      name: "Sarah Thompson",
      email: "sarah.thompson@example.com",
      phone: "+1 (555) 345-6789",
      dateOfBirth: "1988-09-25",
      address: "303 Cedar Ave, Village, Country",
      investmentAmount: 40000,
      status: "PENDING",
      paymentStatus: "SAFE_UNSIGNED",
      kycStatus: "VERIFIED",
      createdAt: "2023-05-16",
      documents: [
        {
          id: 17,
          name: "Passport",
          type: "ID",
          status: "VERIFIED",
          date: "2023-05-16",
          url: "/placeholder.svg?height=600&width=800",
        },
        {
          id: 18,
          name: "Bank Statement",
          type: "ADDRESS",
          status: "VERIFIED",
          date: "2023-05-16",
          url: "/placeholder.svg?height=600&width=800",
        },
        {
          id: 19,
          name: "SAFE Agreement",
          type: "AGREEMENT",
          status: "UNSIGNED",
          date: "2023-05-16",
          url: "/placeholder.svg?height=600&width=800",
        },
      ],
    },
    {
      id: 7,
      name: "David Brown",
      email: "david.brown@example.com",
      phone: "+1 (555) 567-8901",
      dateOfBirth: "1975-12-05",
      address: "404 Birch Rd, City, Country",
      investmentAmount: 35000,
      status: "VERIFIED",
      paymentStatus: "COMPLETED",
      kycStatus: "VERIFIED",
      createdAt: "2023-05-09",
      documents: [
        {
          id: 19,
          name: "Driver's License",
          type: "ID",
          status: "VERIFIED",
          date: "2023-05-08",
          url: "/placeholder.svg?height=600&width=800",
        },
        {
          id: 20,
          name: "Utility Bill",
          type: "ADDRESS",
          status: "VERIFIED",
          date: "2023-05-08",
          url: "/placeholder.svg?height=600&width=800",
        },
        {
          id: 21,
          name: "SAFE Agreement",
          type: "AGREEMENT",
          status: "SIGNED",
          date: "2023-05-09",
          url: "/placeholder.svg?height=600&width=800",
        },
        {
          id: 22,
          name: "Bank Transfer Receipt",
          type: "PAYMENT",
          status: "APPROVED",
          date: "2023-05-09",
          url: "/placeholder.svg?height=600&width=800",
        },
      ],
    },
    {
      id: 8,
      name: "Jennifer Miller",
      email: "jennifer.miller@example.com",
      phone: "+1 (555) 678-9012",
      dateOfBirth: "1992-04-15",
      address: "505 Walnut St, Town, Country",
      investmentAmount: 0,
      status: "REJECTED",
      paymentStatus: "NOT_STARTED",
      kycStatus: "REJECTED",
      createdAt: "2023-05-11",
      documents: [
        {
          id: 23,
          name: "Passport",
          type: "ID",
          status: "REJECTED",
          date: "2023-05-11",
          url: "/placeholder.svg?height=600&width=800",
        },
      ],
      rejectionReason: "Suspicious activity detected. Account has been rejected.",
    },
    // Add more investors for testing
    {
      id: 9,
      name: "Thomas Anderson",
      email: "thomas.anderson@example.com",
      phone: "+1 (555) 789-0123",
      dateOfBirth: "1983-08-20",
      address: "606 Pine St, City, Country",
      investmentAmount: 40000,
      status: "VERIFIED",
      paymentStatus: "COMPLETED",
      kycStatus: "VERIFIED",
      createdAt: "2023-05-07",
      documents: [
        {
          id: 24,
          name: "Driver's License",
          type: "ID",
          status: "VERIFIED",
          date: "2023-05-06",
          url: "/placeholder.svg?height=600&width=800",
        },
        {
          id: 25,
          name: "Utility Bill",
          type: "ADDRESS",
          status: "VERIFIED",
          date: "2023-05-06",
          url: "/placeholder.svg?height=600&width=800",
        },
        {
          id: 26,
          name: "SAFE Agreement",
          type: "AGREEMENT",
          status: "SIGNED",
          date: "2023-05-07",
          url: "/placeholder.svg?height=600&width=800",
        },
        {
          id: 27,
          name: "Credit Card Payment",
          type: "PAYMENT",
          status: "COMPLETED",
          date: "2023-05-07",
          url: "/placeholder.svg?height=600&width=800",
        },
      ],
    },
    {
      id: 10,
      name: "Olivia Parker",
      email: "olivia.parker@example.com",
      phone: "+1 (555) 890-1234",
      dateOfBirth: "1991-01-12",
      address: "707 Oak St, Town, Country",
      investmentAmount: 30000,
      status: "VERIFIED",
      paymentStatus: "SAFE_UNSIGNED",
      kycStatus: "VERIFIED",
      createdAt: "2023-05-17",
      documents: [
        {
          id: 28,
          name: "Passport",
          type: "ID",
          status: "VERIFIED",
          date: "2023-05-17",
          url: "/placeholder.svg?height=600&width=800",
        },
        {
          id: 29,
          name: "Bank Statement",
          type: "ADDRESS",
          status: "VERIFIED",
          date: "2023-05-17",
          url: "/placeholder.svg?height=600&width=800",
        },
        {
          id: 30,
          name: "SAFE Agreement",
          type: "AGREEMENT",
          status: "UNSIGNED",
          date: "2023-05-17",
          url: "/placeholder.svg?height=600&width=800",
        },
      ],
    },
    {
      id: 11,
      name: "William Turner",
      email: "william.turner@example.com",
      phone: "+1 (555) 901-2345",
      dateOfBirth: "1976-09-08",
      address: "808 Maple Ave, Village, Country",
      investmentAmount: 60000,
      status: "VERIFIED",
      paymentStatus: "COMPLETED",
      kycStatus: "VERIFIED",
      createdAt: "2023-05-06",
      paymentPlan: "INSTALLMENT",
      remainingPayments: 4,
      documents: [
        {
          id: 30,
          name: "Driver's License",
          type: "ID",
          status: "VERIFIED",
          date: "2023-05-05",
          url: "/placeholder.svg?height=600&width=800",
        },
        {
          id: 31,
          name: "Utility Bill",
          type: "ADDRESS",
          status: "VERIFIED",
          date: "2023-05-05",
          url: "/placeholder.svg?height=600&width=800",
        },
        {
          id: 32,
          name: "SAFE Agreement",
          type: "AGREEMENT",
          status: "SIGNED",
          date: "2023-05-06",
          url: "/placeholder.svg?height=600&width=800",
        },
        {
          id: 33,
          name: "Bank Transfer Receipt",
          type: "PAYMENT",
          status: "APPROVED",
          date: "2023-05-06",
          url: "/placeholder.svg?height=600&width=800",
        },
      ],
    },
    {
      id: 12,
      name: "Sophia Martinez",
      email: "sophia.martinez@example.com",
      phone: "+1 (555) 012-3456",
      dateOfBirth: "1989-03-25",
      address: "909 Cedar Rd, City, Country",
      investmentAmount: 30000,
      status: "VERIFIED",
      paymentStatus: "PENDING_APPROVAL",
      kycStatus: "VERIFIED",
      createdAt: "2023-05-13",
      documents: [
        {
          id: 34,
          name: "Passport",
          type: "ID",
          status: "VERIFIED",
          date: "2023-05-12",
          url: "/placeholder.svg?height=600&width=800",
        },
        {
          id: 35,
          name: "Bank Statement",
          type: "ADDRESS",
          status: "VERIFIED",
          date: "2023-05-12",
          url: "/placeholder.svg?height=600&width=800",
        },
        {
          id: 36,
          name: "SAFE Agreement",
          type: "AGREEMENT",
          status: "SIGNED",
          date: "2023-05-13",
          url: "/placeholder.svg?height=600&width=800",
        },
        {
          id: 37,
          name: "Bank Transfer Receipt",
          type: "PAYMENT",
          status: "PENDING_APPROVAL",
          date: "2023-05-13",
          url: "/placeholder.svg?height=600&width=800",
        },
      ],
    },
    {
      id: 13,
      name: "James Wilson",
      email: "james.wilson@example.com",
      phone: "+1 (555) 123-4567",
      dateOfBirth: "1980-11-15",
      address: "101 Birch St, Town, Country",
      investmentAmount: 0,
      status: "REJECTED",
      paymentStatus: "NOT_STARTED",
      kycStatus: "REJECTED",
      createdAt: "2023-05-14",
      documents: [
        {
          id: 38,
          name: "ID Card",
          type: "ID",
          status: "REJECTED",
          date: "2023-05-14",
          url: "/placeholder.svg?height=600&width=800",
        },
        {
          id: 39,
          name: "Proof of Address",
          type: "ADDRESS",
          status: "REJECTED",
          date: "2023-05-14",
          url: "/placeholder.svg?height=600&width=800",
        },
      ],
      rejectionReason: "Documents appear to be expired.",
    },
    {
      id: 14,
      name: "Emma Johnson",
      email: "emma.johnson@example.com",
      phone: "+1 (555) 234-5678",
      dateOfBirth: "1993-07-30",
      address: "202 Walnut Dr, Village, Country",
      investmentAmount: 45000,
      status: "VERIFIED",
      paymentStatus: "COMPLETED",
      kycStatus: "VERIFIED",
      createdAt: "2023-05-05",
      documents: [
        {
          id: 40,
          name: "Driver's License",
          type: "ID",
          status: "VERIFIED",
          date: "2023-05-04",
          url: "/placeholder.svg?height=600&width=800",
        },
        {
          id: 41,
          name: "Utility Bill",
          type: "ADDRESS",
          status: "VERIFIED",
          date: "2023-05-04",
          url: "/placeholder.svg?height=600&width=800",
        },
        {
          id: 42,
          name: "SAFE Agreement",
          type: "AGREEMENT",
          status: "SIGNED",
          date: "2023-05-05",
          url: "/placeholder.svg?height=600&width=800",
        },
        {
          id: 43,
          name: "Credit Card Payment",
          type: "PAYMENT",
          status: "COMPLETED",
          date: "2023-05-05",
          url: "/placeholder.svg?height=600&width=800",
        },
      ],
    },
    {
      id: 15,
      name: "Alexander Brown",
      email: "alexander.brown@example.com",
      phone: "+1 (555) 345-6789",
      dateOfBirth: "1987-02-18",
      address: "303 Elm St, City, Country",
      investmentAmount: 0,
      status: "PENDING",
      paymentStatus: "NOT_STARTED",
      kycStatus: "PENDING",
      createdAt: "2023-05-18",
      documents: [
        {
          id: 44,
          name: "Passport",
          type: "ID",
          status: "PENDING",
          date: "2023-05-18",
          url: "/placeholder.svg?height=600&width=800",
        },
        {
          id: 45,
          name: "Bank Statement",
          type: "ADDRESS",
          status: "PENDING",
          date: "2023-05-18",
          url: "/placeholder.svg?height=600&width=800",
        },
      ],
    },
    {
      id: 16,
      name: "Isabella Garcia",
      email: "isabella.garcia@example.com",
      phone: "+1 (555) 456-7890",
      dateOfBirth: "1984-12-05",
      address: "404 Pine Ave, Town, Country",
      investmentAmount: 55000,
      status: "VERIFIED",
      paymentStatus: "COMPLETED",
      kycStatus: "VERIFIED",
      createdAt: "2023-05-04",
      documents: [
        {
          id: 46,
          name: "Driver's License",
          type: "ID",
          status: "VERIFIED",
          date: "2023-05-03",
          url: "/placeholder.svg?height=600&width=800",
        },
        {
          id: 47,
          name: "Utility Bill",
          type: "ADDRESS",
          status: "VERIFIED",
          date: "2023-05-03",
          url: "/placeholder.svg?height=600&width=800",
        },
        {
          id: 48,
          name: "SAFE Agreement",
          type: "AGREEMENT",
          status: "SIGNED",
          date: "2023-05-04",
          url: "/placeholder.svg?height=600&width=800",
        },
        {
          id: 49,
          name: "Bank Transfer Receipt",
          type: "PAYMENT",
          status: "APPROVED",
          date: "2023-05-04",
          url: "/placeholder.svg?height=600&width=800",
        },
      ],
    },
    {
      id: 17,
      name: "Ethan Miller",
      email: "ethan.miller@example.com",
      phone: "+1 (555) 567-8901",
      dateOfBirth: "1995-05-22",
      address: "505 Oak Rd, Village, Country",
      investmentAmount: 0,
      status: "REJECTED",
      paymentStatus: "NOT_STARTED",
      kycStatus: "REJECTED",
      createdAt: "2023-05-10",
      documents: [
        {
          id: 50,
          name: "ID Card",
          type: "ID",
          status: "REJECTED",
          date: "2023-05-10",
          url: "/placeholder.svg?height=600&width=800",
        },
      ],
      rejectionReason: "Multiple suspicious document submissions detected.",
    },
    {
      id: 18,
      name: "Ava Thompson",
      email: "ava.thompson@example.com",
      phone: "+1 (555) 678-9012",
      dateOfBirth: "1990-09-14",
      address: "606 Maple St, City, Country",
      investmentAmount: 70000,
      status: "VERIFIED",
      paymentStatus: "COMPLETED",
      kycStatus: "VERIFIED",
      createdAt: "2023-05-03",
      documents: [
        {
          id: 51,
          name: "Passport",
          type: "ID",
          status: "VERIFIED",
          date: "2023-05-02",
          url: "/placeholder.svg?height=600&width=800",
        },
        {
          id: 52,
          name: "Bank Statement",
          type: "ADDRESS",
          status: "VERIFIED",
          date: "2023-05-02",
          url: "/placeholder.svg?height=600&width=800",
        },
        {
          id: 53,
          name: "SAFE Agreement",
          type: "AGREEMENT",
          status: "SIGNED",
          date: "2023-05-03",
          url: "/placeholder.svg?height=600&width=800",
        },
        {
          id: 54,
          name: "Credit Card Payment",
          type: "PAYMENT",
          status: "COMPLETED",
          date: "2023-05-03",
          url: "/placeholder.svg?height=600&width=800",
        },
      ],
    },
    {
      id: 19,
      name: "Noah Davis",
      email: "noah.davis@example.com",
      phone: "+1 (555) 789-0123",
      dateOfBirth: "1981-04-09",
      address: "707 Cedar Ave, Town, Country",
      investmentAmount: 0,
      status: "PENDING",
      paymentStatus: "NOT_STARTED",
      kycStatus: "PENDING",
      createdAt: "2023-05-19",
      documents: [
        {
          id: 55,
          name: "Driver's License",
          type: "ID",
          status: "PENDING",
          date: "2023-05-19",
          url: "/placeholder.svg?height=600&width=800",
        },
        {
          id: 56,
          name: "Utility Bill",
          type: "ADDRESS",
          status: "PENDING",
          date: "2023-05-19",
          url: "/placeholder.svg?height=600&width=800",
        },
      ],
    },
    {
      id: 20,
      name: "Mia Wilson",
      email: "mia.wilson@example.com",
      phone: "+1 (555) 890-1234",
      dateOfBirth: "1986-10-27",
      address: "808 Birch Dr, Village, Country",
      investmentAmount: 35000,
      status: "VERIFIED",
      paymentStatus: "PENDING_APPROVAL",
      kycStatus: "VERIFIED",
      createdAt: "2023-05-12",
      documents: [
        {
          id: 57,
          name: "Passport",
          type: "ID",
          status: "VERIFIED",
          date: "2023-05-11",
          url: "/placeholder.svg?height=600&width=800",
        },
        {
          id: 58,
          name: "Bank Statement",
          type: "ADDRESS",
          status: "VERIFIED",
          date: "2023-05-11",
          url: "/placeholder.svg?height=600&width=800",
        },
        {
          id: 59,
          name: "SAFE Agreement",
          type: "AGREEMENT",
          status: "SIGNED",
          date: "2023-05-12",
          url: "/placeholder.svg?height=600&width=800",
        },
        {
          id: 60,
          name: "Bank Transfer Receipt",
          type: "PAYMENT",
          status: "PENDING_APPROVAL",
          date: "2023-05-12",
          url: "/placeholder.svg?height=600&width=800",
        },
      ],
    },
    {
      id: 21,
      name: "Lucas Martinez",
      email: "lucas.martinez@example.com",
      phone: "+1 (555) 901-2345",
      dateOfBirth: "1979-08-03",
      address: "909 Walnut St, City, Country",
      investmentAmount: 65000,
      status: "VERIFIED",
      paymentStatus: "COMPLETED",
      kycStatus: "VERIFIED",
      createdAt: "2023-05-02",
      documents: [
        {
          id: 61,
          name: "Driver's License",
          type: "ID",
          status: "VERIFIED",
          date: "2023-05-01",
          url: "/placeholder.svg?height=600&width=800",
        },
        {
          id: 62,
          name: "Utility Bill",
          type: "ADDRESS",
          status: "VERIFIED",
          date: "2023-05-01",
          url: "/placeholder.svg?height=600&width=800",
        },
        {
          id: 63,
          name: "SAFE Agreement",
          type: "AGREEMENT",
          status: "SIGNED",
          date: "2023-05-02",
          url: "/placeholder.svg?height=600&width=800",
        },
        {
          id: 64,
          name: "Bank Transfer Receipt",
          type: "PAYMENT",
          status: "APPROVED",
          date: "2023-05-02",
          url: "/placeholder.svg?height=600&width=800",
        },
      ],
    },
    {
      id: 22,
      name: "Charlotte Johnson",
      email: "charlotte.johnson@example.com",
      phone: "+1 (555) 012-3456",
      dateOfBirth: "1992-06-19",
      address: "101 Elm Ave, Town, Country",
      investmentAmount: 0,
      status: "REJECTED",
      paymentStatus: "NOT_STARTED",
      kycStatus: "REJECTED",
      createdAt: "2023-05-13",
      documents: [
        {
          id: 65,
          name: "ID Card",
          type: "ID",
          status: "REJECTED",
          date: "2023-05-13",
          url: "/placeholder.svg?height=600&width=800",
        },
        {
          id: 66,
          name: "Proof of Address",
          type: "ADDRESS",
          status: "REJECTED",
          date: "2023-05-13",
          url: "/placeholder.svg?height=600&width=800",
        },
      ],
      rejectionReason: "Documents do not match provided information.",
    },
    {
      id: 23,
      name: "Benjamin Brown",
      email: "benjamin.brown@example.com",
      phone: "+1 (555) 123-4567",
      dateOfBirth: "1983-12-11",
      address: "202 Pine Rd, Village, Country",
      investmentAmount: 40000,
      status: "VERIFIED",
      paymentStatus: "COMPLETED",
      kycStatus: "VERIFIED",
      createdAt: "2023-05-01",
      documents: [
        {
          id: 67,
          name: "Passport",
          type: "ID",
          status: "VERIFIED",
          date: "2023-04-30",
          url: "/placeholder.svg?height=600&width=800",
        },
        {
          id: 68,
          name: "Bank Statement",
          type: "ADDRESS",
          status: "VERIFIED",
          date: "2023-04-30",
          url: "/placeholder.svg?height=600&width=800",
        },
        {
          id: 69,
          name: "SAFE Agreement",
          type: "AGREEMENT",
          status: "SIGNED",
          date: "2023-05-01",
          url: "/placeholder.svg?height=600&width=800",
        },
        {
          id: 70,
          name: "Credit Card Payment",
          type: "PAYMENT",
          status: "COMPLETED",
          date: "2023-05-01",
          url: "/placeholder.svg?height=600&width=800",
        },
      ],
    },
    {
      id: 24,
      name: "Laura Wilson",
      email: "laura.wilson@example.com",
      phone: "+1 (555) 234-5678",
      dateOfBirth: "1988-04-12",
      address: "505 Pine St, City, Country",
      investmentAmount: 25000,
      status: "VERIFIED",
      paymentStatus: "FAILED",
      kycStatus: "VERIFIED",
      createdAt: "2023-05-20",
      documents: [
        {
          id: 71,
          name: "Driver's License",
          type: "ID",
          status: "VERIFIED",
          date: "2023-05-19",
          url: "/placeholder.svg?height=600&width=800",
        },
        {
          id: 72,
          name: "Utility Bill",
          type: "ADDRESS",
          status: "VERIFIED",
          date: "2023-05-19",
          url: "/placeholder.svg?height=600&width=800",
        },
        {
          id: 73,
          name: "SAFE Agreement",
          type: "AGREEMENT",
          status: "SIGNED",
          date: "2023-05-20",
          url: "/placeholder.svg?height=600&width=800",
        },
        {
          id: 74,
          name: "Credit Card Payment",
          type: "PAYMENT",
          status: "FAILED",
          date: "2023-05-20",
          url: "/placeholder.svg?height=600&width=800",
        },
      ],
    },
  ]

  const filteredInvestors = investors.filter(
    (investor) =>
      investor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      investor.email.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const paginatedInvestors = filteredInvestors.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)

  const totalPages = Math.ceil(filteredInvestors.length / ITEMS_PER_PAGE)

  const getStatusBadge = (status: string) => {
    switch (status.toUpperCase()) {
      case "VERIFIED":
      case "APPROVED":
      case "COMPLETED":
      case "SIGNED":
        return (
          <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
            <CheckCircle className="mr-1 h-3 w-3" />
            {status.charAt(0) + status.slice(1).toLowerCase().replace("_", " ")}
          </Badge>
        )
      case "REJECTED":
      case "FAILED":
        return (
          <Badge variant="destructive">
            <XCircle className="mr-1 h-3 w-3" />
            {status === "REJECTED" ? "Rejected" : "Failed"}
          </Badge>
        )
      case "PENDING":
      case "PENDING_APPROVAL":
        return (
          <Badge variant="outline" className="text-yellow-800 dark:text-yellow-300">
            <AlertCircle className="mr-1 h-3 w-3" />
            {status === "PENDING" ? "Pending" : "Pending Approval"}
          </Badge>
        )
      case "SAFE_UNSIGNED":
        return (
          <Badge
            variant="outline"
            className="text-orange-800 dark:text-orange-300 border-orange-300 dark:border-orange-800"
          >
            <FileText className="mr-1 h-3 w-3" />
            SAFE unsigned
          </Badge>
        )
      case "NOT_STARTED":
        return (
          <Badge variant="outline" className="text-gray-500">
            Not Started
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const handleExportData = () => {
    const headers = ["ID", "Name", "Email", "Status", "KYC Status", "Payment Status", "Investment Amount", "Date"]
    const csvData = [
      headers.join(","),
      ...filteredInvestors.map((investor) =>
        [
          investor.id,
          investor.name,
          investor.email,
          investor.status,
          investor.kycStatus,
          investor.paymentStatus,
          investor.investmentAmount,
          investor.createdAt,
        ].join(","),
      ),
    ].join("\n")

    const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", "investors-data.csv")
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    toast({
      title: "Export successful",
      description: "Investors data has been downloaded as CSV",
    })
  }

  const handleApproveKYC = () => {
    if (!selectedInvestor) return

    toast({
      title: "KYC Approved",
      description: `${selectedInvestor.name}'s KYC verification has been approved`,
    })

    // In a real app, this would update the database
    setSelectedInvestor({
      ...selectedInvestor,
      status: "VERIFIED",
      kycStatus: "VERIFIED",
      documents: selectedInvestor.documents.map((doc: any) =>
        doc.type === "ID" || doc.type === "ADDRESS" ? { ...doc, status: "VERIFIED" } : doc,
      ),
    })
  }

  const handleRejectKYC = () => {
    if (!selectedInvestor || !rejectionReason) {
      toast({
        title: "Rejection reason required",
        description: "Please provide a reason for rejection",
        variant: "destructive",
      })
      return
    }

    toast({
      title: "KYC Rejected",
      description: `${selectedInvestor.name}'s KYC verification has been rejected`,
    })

    // In a real app, this would update the database
    setSelectedInvestor({
      ...selectedInvestor,
      status: "REJECTED",
      kycStatus: "REJECTED",
      rejectionReason: rejectionReason,
      documents: selectedInvestor.documents.map((doc: any) =>
        doc.type === "ID" || doc.type === "ADDRESS" ? { ...doc, status: "REJECTED" } : doc,
      ),
    })

    setRejectionReason("")
  }

  const handleApprovePayment = () => {
    if (!selectedInvestor) return

    toast({
      title: "Payment Approved",
      description: `Payment of $${selectedInvestor.investmentAmount.toLocaleString()} has been approved for ${selectedInvestor.name}`,
    })

    // In a real app, this would update the database
    setSelectedInvestor({
      ...selectedInvestor,
      paymentStatus: "COMPLETED",
      documents: selectedInvestor.documents.map((doc: any) =>
        doc.type === "PAYMENT" ? { ...doc, status: "APPROVED" } : doc,
      ),
    })

    setPaymentApprovalOpen(false)
  }

  const handleRejectPayment = () => {
    if (!selectedInvestor || !rejectionReason) {
      toast({
        title: "Rejection reason required",
        description: "Please provide a reason for rejection",
        variant: "destructive",
      })
      return
    }

    toast({
      title: "Payment Rejected",
      description: `Payment for ${selectedInvestor.name} has been rejected`,
    })

    // In a real app, this would update the database
    setSelectedInvestor({
      ...selectedInvestor,
      paymentStatus: "REJECTED",
      documents: selectedInvestor.documents.map((doc: any) =>
        doc.type === "PAYMENT" ? { ...doc, status: "REJECTED" } : doc,
      ),
    })

    setPaymentApprovalOpen(false)
    setRejectionReason("")
  }

  const handleViewDocument = (document: any) => {
    setSelectedDocument(document)
    setDocumentPreviewOpen(true)
  }

  const handlePageChange = (newPage: number) => {
    // Store current scroll position
    if (tableRef.current) {
      setScrollPosition(tableRef.current.scrollTop)
    }

    setCurrentPage(newPage)

    // Restore scroll position after render
    requestAnimationFrame(() => {
      if (tableRef.current) {
        tableRef.current.scrollTop = 0
      }
    })
  }

  return (
    <div className="flex-1 p-8 pt-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold tracking-tight">Investors</h2>
        <Button onClick={handleExportData}>Export Data</Button>
      </div>
      <div className="flex gap-4 h-[calc(100vh-12rem)]">
        {/* Left Panel - Investors List */}
        <div className="w-[38%] flex flex-col">
          <div className="mb-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search investors..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <Card className="flex-1 mb-2">
            <div className="h-[calc(100vh-20rem)] overflow-hidden">
              <div className="h-full overflow-auto" ref={tableRef}>
                <Table>
                  <TableHeader className="sticky top-0 bg-background z-10">
                    <TableRow>
                      <TableHead className="w-[30%]">Name</TableHead>
                      <TableHead className="w-[25%]">KYC Status</TableHead>
                      <TableHead className="w-[25%]">Payment</TableHead>
                      <TableHead className="w-[20%]">Plan</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedInvestors.map((investor) => (
                      <TableRow
                        key={investor.id}
                        className={`cursor-pointer ${selectedInvestor?.id === investor.id ? "bg-muted" : ""}`}
                        onClick={() => setSelectedInvestor(investor)}
                      >
                        <TableCell className="font-medium">{investor.name}</TableCell>
                        <TableCell>{getStatusBadge(investor.kycStatus)}</TableCell>
                        <TableCell>{getStatusBadge(investor.paymentStatus)}</TableCell>
                        <TableCell>
                          {investor.kycStatus === "REJECTED" ? (
                            <Badge
                              variant="destructive"
                              className="bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300"
                            >
                              <XCircle className="h-3 w-3 mr-1" />
                              KYC Rejected
                            </Badge>
                          ) : investor.paymentStatus === "NOT_STARTED" ? (
                            <Badge variant="outline" className="text-gray-500">
                              Not Started
                            </Badge>
                          ) : investor.paymentPlan === "INSTALLMENT" ? (
                            <Badge
                              variant="outline"
                              className="bg-blue-50 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300"
                            >
                              Installment ({investor.remainingPayments} left)
                            </Badge>
                          ) : (
                            <Badge variant="outline">Full Payment</Badge>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </Card>

          {/* Enhanced pagination controls */}
          <Card className="p-3.5 mb-2">
            <div className="flex items-center justify-between">
              <Button
                variant="default"
                size="default"
                onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="shadow-md hover:shadow-lg min-w-[100px] flex-shrink-0"
              >
                Previous
              </Button>
              <span className="text-base font-medium px-4 py-2 bg-muted rounded-md">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="default"
                size="default"
                onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="shadow-md hover:shadow-lg min-w-[100px] flex-shrink-0"
              >
                Next
              </Button>
            </div>
          </Card>
        </div>

        {/* Right Panel - Investor Details - aligned with left panel */}
        <div className="flex-1 flex flex-col">
          {selectedInvestor ? (
            <Card className="h-[calc(100vh-12rem-2px)] overflow-hidden">
              <div className="h-full overflow-auto pb-4">
                <CardHeader>
                  <CardTitle>{selectedInvestor.name}</CardTitle>
                  <CardDescription>
                    Created: {new Date(selectedInvestor.createdAt).toLocaleDateString()}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="details" className="space-y-4">
                    <TabsList>
                      <TabsTrigger value="details">Details</TabsTrigger>
                      <TabsTrigger value="documents">Documents</TabsTrigger>
                      <TabsTrigger value="verification">Verification</TabsTrigger>
                      <TabsTrigger value="payment">Payment</TabsTrigger>
                    </TabsList>

                    <TabsContent value="details" className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>First Name</Label>
                          <Input value={selectedInvestor.name.split(" ")[0]} readOnly />
                        </div>
                        <div className="space-y-2">
                          <Label>Last Name</Label>
                          <Input value={selectedInvestor.name.split(" ")[1] || ""} readOnly />
                        </div>
                        <div className="space-y-2">
                          <Label>Email</Label>
                          <Input value={selectedInvestor.email} readOnly />
                        </div>
                        <div className="space-y-2">
                          <Label>Phone</Label>
                          <Input value={selectedInvestor.phone || ""} readOnly />
                        </div>
                        <div className="space-y-2">
                          <Label>Date of Birth</Label>
                          <Input value={selectedInvestor.dateOfBirth || ""} readOnly />
                        </div>
                        <div className="space-y-2">
                          <Label>Address</Label>
                          <Input value={selectedInvestor.address || ""} readOnly />
                        </div>
                        <div className="space-y-2">
                          <Label>Investment Amount</Label>
                          <Input
                            value={
                              selectedInvestor.investmentAmount > 0
                                ? `$${selectedInvestor.investmentAmount.toLocaleString()}`
                                : "N/A"
                            }
                            readOnly
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Status</Label>
                          <div className="h-10 flex items-center">{getStatusBadge(selectedInvestor.status)}</div>
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="documents" className="space-y-4">
                      {selectedInvestor.documents?.map((doc: any) => (
                        <div key={doc.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center">
                            <FileText className="h-5 w-5 mr-2 text-muted-foreground" />
                            <div>
                              <p className="font-medium">{doc.name}</p>
                              <p className="text-sm text-muted-foreground">Uploaded on {doc.date}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-1">
                            {getStatusBadge(doc.status)}
                            <Button variant="outline" size="sm" onClick={() => handleViewDocument(doc)}>
                              <Eye className="h-3 w-3 mr-1" />
                              View
                            </Button>
                            <Button variant="outline" size="sm">
                              <Download className="h-3 w-3 mr-1" />
                              Download
                            </Button>
                          </div>
                        </div>
                      ))}

                      {(!selectedInvestor.documents || selectedInvestor.documents.length === 0) && (
                        <div className="text-center py-8 text-muted-foreground">No documents uploaded yet</div>
                      )}
                    </TabsContent>

                    <TabsContent value="verification" className="space-y-4">
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <div>
                            <h3 className="font-medium">KYC Status</h3>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <span>Current verification status: </span>
                              {getStatusBadge(selectedInvestor.kycStatus || selectedInvestor.status)}
                            </div>
                          </div>
                          {selectedInvestor.status === "PENDING" && (
                            <div className="flex flex-col space-y-2">
                              <Button onClick={handleApproveKYC} size="sm">
                                <CheckCircle className="mr-1 h-3 w-3" />
                                Approve KYC
                              </Button>
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button variant="outline" size="sm">
                                    <XCircle className="mr-1 h-3 w-3" />
                                    Reject KYC
                                  </Button>
                                </DialogTrigger>
                                <DialogContent>
                                  <DialogHeader>
                                    <DialogTitle>Reject KYC Verification</DialogTitle>
                                    <DialogDescription>
                                      Please provide a reason for rejecting this KYC verification.
                                    </DialogDescription>
                                  </DialogHeader>
                                  <div className="py-4">
                                    <Textarea
                                      placeholder="Enter rejection reason..."
                                      value={rejectionReason}
                                      onChange={(e) => setRejectionReason(e.target.value)}
                                      className="min-h-[100px]"
                                    />
                                  </div>
                                  <DialogFooter>
                                    <Button variant="outline" onClick={() => setRejectionReason("")}>
                                      Cancel
                                    </Button>
                                    <Button variant="destructive" onClick={handleRejectKYC}>
                                      Reject
                                    </Button>
                                  </DialogFooter>
                                </DialogContent>
                              </Dialog>
                            </div>
                          )}
                        </div>

                        <Separator />

                        <div className="space-y-4">
                          <h3 className="font-medium">Verification Documents</h3>

                          {/* ID Documents */}
                          <div className="space-y-2">
                            <h4 className="text-sm font-medium">ID Verification</h4>
                            {selectedInvestor.documents
                              ?.filter((doc: any) => doc.type === "ID")
                              .map((doc: any) => (
                                <div key={doc.id} className="flex items-center justify-between p-4 border rounded-lg">
                                  <div className="flex items-center">
                                    <FileText className="h-5 w-5 mr-2 text-muted-foreground" />
                                    <div>
                                      <p className="font-medium">{doc.name}</p>
                                      <p className="text-sm text-muted-foreground">Uploaded on {doc.date}</p>
                                    </div>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    {getStatusBadge(doc.status)}
                                    <Button variant="outline" size="sm" onClick={() => handleViewDocument(doc)}>
                                      <Eye className="h-4 w-4 mr-2" />
                                      View
                                    </Button>
                                  </div>
                                </div>
                              ))}

                            {!selectedInvestor.documents?.some((doc: any) => doc.type === "ID") && (
                              <div className="text-sm text-muted-foreground">No ID documents uploaded</div>
                            )}
                          </div>

                          {/* Address Documents */}
                          <div className="space-y-2">
                            <h4 className="text-sm font-medium">Address Verification</h4>
                            {selectedInvestor.documents
                              ?.filter((doc: any) => doc.type === "ADDRESS")
                              .map((doc: any) => (
                                <div key={doc.id} className="flex items-center justify-between p-4 border rounded-lg">
                                  <div className="flex items-center">
                                    <FileText className="h-5 w-5 mr-2 text-muted-foreground" />
                                    <div>
                                      <p className="font-medium">{doc.name}</p>
                                      <p className="text-sm text-muted-foreground">Uploaded on {doc.date}</p>
                                    </div>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    {getStatusBadge(doc.status)}
                                    <Button variant="outline" size="sm" onClick={() => handleViewDocument(doc)}>
                                      <Eye className="h-4 w-4 mr-2" />
                                      View
                                    </Button>
                                  </div>
                                </div>
                              ))}

                            {!selectedInvestor.documents?.some((doc: any) => doc.type === "ADDRESS") && (
                              <div className="text-sm text-muted-foreground">No address documents uploaded</div>
                            )}
                          </div>
                        </div>

                        {selectedInvestor.rejectionReason && (
                          <div className="space-y-2 mt-4">
                            <Label>Rejection Reason</Label>
                            <div className="p-4 border rounded-lg bg-red-50 dark:bg-red-950/20 text-red-800 dark:text-red-300">
                              {selectedInvestor.rejectionReason}
                            </div>
                          </div>
                        )}
                      </div>
                    </TabsContent>

                    <TabsContent value="payment" className="space-y-4">
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <div>
                            <h3 className="font-medium">Payment Status</h3>
                            <p className="text-sm text-muted-foreground">
                              Current payment status: {getStatusBadge(selectedInvestor.paymentStatus)}
                            </p>
                          </div>
                          {selectedInvestor.paymentStatus === "PENDING_APPROVAL" && (
                            <div>
                              <Button size="sm" onClick={() => setPaymentApprovalOpen(true)}>
                                <CheckCircle className="mr-1 h-3 w-3" />
                                Review Payment
                              </Button>
                            </div>
                          )}
                        </div>

                        <Separator />

                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label>Investment Amount</Label>
                              <Input
                                value={
                                  selectedInvestor.investmentAmount > 0
                                    ? `$${selectedInvestor.investmentAmount.toLocaleString()}`
                                    : "N/A"
                                }
                                readOnly
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Payment Method</Label>
                              <Input
                                value={
                                  selectedInvestor.documents?.some(
                                    (doc: any) => doc.type === "PAYMENT" && doc.name.includes("Bank"),
                                  )
                                    ? "Bank Transfer"
                                    : selectedInvestor.documents?.some(
                                          (doc: any) => doc.type === "PAYMENT" && doc.name.includes("Credit"),
                                        )
                                      ? "Credit Card"
                                      : "Not Selected"
                                }
                                readOnly
                              />
                            </div>
                          </div>

                          {/* Payment Documents */}
                          <div className="space-y-2">
                            <h4 className="text-sm font-medium">Payment Documents</h4>
                            {selectedInvestor.documents
                              ?.filter((doc: any) => doc.type === "PAYMENT")
                              .map((doc: any) => (
                                <div key={doc.id} className="flex items-center justify-between p-4 border rounded-lg">
                                  <div className="flex items-center">
                                    {doc.name.includes("Bank") ? (
                                      <Upload className="h-5 w-5 mr-2 text-muted-foreground" />
                                    ) : (
                                      <CreditCard className="h-5 w-5 mr-2 text-muted-foreground" />
                                    )}
                                    <div>
                                      <p className="font-medium">{doc.name}</p>
                                      <p className="text-sm text-muted-foreground">Uploaded on {doc.date}</p>
                                    </div>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    {getStatusBadge(doc.status)}
                                    <Button variant="outline" size="sm" onClick={() => handleViewDocument(doc)}>
                                      <Eye className="h-4 w-4 mr-2" />
                                      View
                                    </Button>
                                  </div>
                                </div>
                              ))}

                            {!selectedInvestor.documents?.some((doc: any) => doc.type === "PAYMENT") && (
                              <div className="text-sm text-muted-foreground">No payment documents uploaded</div>
                            )}
                          </div>

                          {/* SAFE Agreement */}
                          <div className="space-y-2">
                            <h4 className="text-sm font-medium">SAFE Agreement</h4>
                            {selectedInvestor.documents
                              ?.filter((doc: any) => doc.type === "AGREEMENT")
                              .map((doc: any) => (
                                <div key={doc.id} className="flex items-center justify-between p-4 border rounded-lg">
                                  <div className="flex items-center">
                                    <FileText className="h-5 w-5 mr-2 text-muted-foreground" />
                                    <div>
                                      <p className="font-medium">{doc.name}</p>
                                      <p className="text-sm text-muted-foreground">Signed on {doc.date}</p>
                                    </div>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    {getStatusBadge(doc.status)}
                                    <Button variant="outline" size="sm" onClick={() => handleViewDocument(doc)}>
                                      <Eye className="h-4 w-4 mr-2" />
                                      View
                                    </Button>
                                    <Button variant="outline" size="sm">
                                      <Download className="h-4 w-4 mr-2" />
                                      Download
                                    </Button>
                                  </div>
                                </div>
                              ))}

                            {!selectedInvestor.documents?.some((doc: any) => doc.type === "AGREEMENT") && (
                              <div className="text-sm text-muted-foreground">No signed agreements</div>
                            )}
                          </div>
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </div>
            </Card>
          ) : (
            <Card className="h-[calc(100vh-12rem-2px)] flex items-center justify-center text-muted-foreground">
              Select an investor to view details
            </Card>
          )}
        </div>
      </div>
      <Dialog open={paymentApprovalOpen} onOpenChange={setPaymentApprovalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Payment Approval</DialogTitle>
            <DialogDescription>
              Review and approve or reject the payment of ${selectedInvestor?.investmentAmount.toLocaleString()}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Payment Document</Label>
                {selectedInvestor?.documents
                  ?.filter((doc: any) => doc.type === "PAYMENT" && doc.status === "PENDING_APPROVAL")
                  .map((doc: any) => (
                    <div key={doc.id} className="border rounded-lg overflow-hidden">
                      <img
                        src={doc.url || "/placeholder.svg"}
                        alt={doc.name}
                        className="w-full h-auto max-h-[300px] object-contain"
                      />
                      <div className="p-2 bg-muted">
                        <p className="text-sm font-medium">{doc.name}</p>
                        <p className="text-xs text-muted-foreground">Uploaded on {doc.date}</p>
                      </div>
                    </div>
                  ))}
              </div>

              <div className="space-y-2">
                <Label htmlFor="rejection-reason">Rejection Reason (required if rejecting)</Label>
                <Textarea
                  id="rejection-reason"
                  placeholder="Enter reason for rejection..."
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPaymentApprovalOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleRejectPayment}>
              <XCircle className="mr-2 h-4 w-4" />
              Reject
            </Button>
            <Button onClick={handleApprovePayment}>
              <CheckCircle className="mr-2 h-4 w-4" />
              Approve
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog open={documentPreviewOpen} onOpenChange={setDocumentPreviewOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{selectedDocument?.name}</DialogTitle>
            <DialogDescription>Uploaded on {selectedDocument?.date}</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="border rounded-lg overflow-hidden">
              <img
                src={selectedDocument?.url || "/placeholder.svg"}
                alt={selectedDocument?.name}
                className="w-full h-auto max-h-[500px] object-contain"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDocumentPreviewOpen(false)}>
              Close
            </Button>
            <Button>
              <Download className="mr-2 h-4 w-4" />
              Download
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

