"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useToast } from "@/hooks/use-toast"
import { Search, MoreHorizontal, CheckCircle, XCircle, Clock } from "lucide-react"

export default function KYCVerificationPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const { toast } = useToast()

  // Mock data for KYC verifications
  const verifications = [
    {
      id: 1,
      investor: "John Doe",
      email: "john.doe@example.com",
      status: "Verified",
      submittedDate: "2023-05-09",
      verifiedDate: "2023-05-09",
    },
    {
      id: 2,
      investor: "Jane Smith",
      email: "jane.smith@example.com",
      status: "Pending",
      submittedDate: "2023-05-12",
      verifiedDate: null,
    },
    {
      id: 3,
      investor: "Robert Johnson",
      email: "robert.johnson@example.com",
      status: "Rejected",
      submittedDate: "2023-05-10",
      verifiedDate: "2023-05-11",
    },
    {
      id: 4,
      investor: "Emily Davis",
      email: "emily.davis@example.com",
      status: "Verified",
      submittedDate: "2023-05-07",
      verifiedDate: "2023-05-08",
    },
    {
      id: 5,
      investor: "Michael Wilson",
      email: "michael.wilson@example.com",
      status: "Pending",
      submittedDate: "2023-05-15",
      verifiedDate: null,
    },
  ]

  const filteredVerifications = verifications.filter(
    (verification) =>
      verification.investor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      verification.email.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const pendingVerifications = filteredVerifications.filter((v) => v.status === "Pending")
  const completedVerifications = filteredVerifications.filter((v) => v.status !== "Pending")

  const handleViewDetails = (id: number) => {
    window.location.href = `/admin/investors/${id}`
  }

  const handleApprove = (id: number) => {
    toast({
      title: "KYC Approved",
      description: "The investor's KYC verification has been approved",
    })
  }

  const handleReject = (id: number) => {
    toast({
      title: "KYC Rejected",
      description: "The investor's KYC verification has been rejected",
    })
  }

  // Update the getStatusBadge function to be consistent with our changes
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Verified":
        return (
          <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
            <CheckCircle className="mr-1 h-3 w-3" />
            Verified
          </Badge>
        )
      case "Rejected":
        return (
          <Badge variant="destructive">
            <XCircle className="mr-1 h-3 w-3" />
            Rejected
          </Badge>
        )
      case "Pending":
        return (
          <Badge variant="outline" className="text-yellow-800 dark:text-yellow-300">
            <Clock className="mr-1 h-3 w-3" />
            Pending
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">KYC Verification</h2>
      </div>

      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search investors..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <Tabs defaultValue="pending" className="space-y-4">
        <TabsList>
          <TabsTrigger value="pending">Pending Verification ({pendingVerifications.length})</TabsTrigger>
          <TabsTrigger value="completed">Completed ({completedVerifications.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Pending KYC Verifications</CardTitle>
              <CardDescription>Review and verify investor KYC submissions</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Investor</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Submitted Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pendingVerifications.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-4 text-muted-foreground">
                        No pending verifications found
                      </TableCell>
                    </TableRow>
                  ) : (
                    pendingVerifications.map((verification) => (
                      <TableRow key={verification.id}>
                        <TableCell className="font-medium">{verification.investor}</TableCell>
                        <TableCell>{verification.email}</TableCell>
                        <TableCell>{verification.submittedDate}</TableCell>
                        <TableCell>{getStatusBadge(verification.status)}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button size="sm" onClick={() => handleApprove(verification.id)}>
                              <CheckCircle className="mr-1 h-4 w-4" />
                              Approve
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => handleReject(verification.id)}>
                              <XCircle className="mr-1 h-4 w-4" />
                              Reject
                            </Button>
                            <Button size="sm" variant="ghost" onClick={() => handleViewDetails(verification.id)}>
                              View
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Completed Verifications</CardTitle>
              <CardDescription>All verified or rejected KYC submissions</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Investor</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Submitted Date</TableHead>
                    <TableHead>Verified Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {completedVerifications.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-4 text-muted-foreground">
                        No completed verifications found
                      </TableCell>
                    </TableRow>
                  ) : (
                    completedVerifications.map((verification) => (
                      <TableRow key={verification.id}>
                        <TableCell className="font-medium">{verification.investor}</TableCell>
                        <TableCell>{verification.email}</TableCell>
                        <TableCell>{verification.submittedDate}</TableCell>
                        <TableCell>{verification.verifiedDate}</TableCell>
                        <TableCell>{getStatusBadge(verification.status)}</TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleViewDetails(verification.id)}>
                                View Details
                              </DropdownMenuItem>
                              {verification.status === "Rejected" && (
                                <DropdownMenuItem onClick={() => handleApprove(verification.id)}>
                                  Approve
                                </DropdownMenuItem>
                              )}
                              {verification.status === "Verified" && (
                                <DropdownMenuItem onClick={() => handleReject(verification.id)}>
                                  Reject
                                </DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

