"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useToast } from "@/hooks/use-toast"
import { AlertCircle, Copy, Link2, Send } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function InvitesPage() {
  const [email, setEmail] = useState("")
  const [generatedLink, setGeneratedLink] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [invites, setInvites] = useState([
    { id: 1, email: "investor1@example.com", status: "Pending", created: "2023-05-10" },
    { id: 2, email: "investor2@example.com", status: "Accepted", created: "2023-05-09" },
    { id: 3, email: "investor3@example.com", status: "Expired", created: "2023-05-01" },
  ])
  const { toast } = useToast()

  const handleSendInvite = () => {
    if (!email) return

    // In a real app, this would call an API to send the invite
    const newInvite = {
      id: invites.length + 1,
      email,
      status: "Pending",
      created: new Date().toISOString().split("T")[0],
    }

    setInvites([newInvite, ...invites])
    setEmail("")

    toast({
      title: "Invite sent",
      description: `Invitation has been sent to ${email}`,
    })
  }

  const copyInviteLink = (id: number) => {
    // In a real app, this would generate and copy a unique invite link
    navigator.clipboard.writeText(
      `https://funding-platform.com/invite/${id}-${Math.random().toString(36).substring(2, 9)}`,
    )

    toast({
      title: "Link copied",
      description: "Invite link has been copied to clipboard",
    })
  }

  const generateInviteLink = async () => {
    setIsGenerating(true)

    try {
      // Simulate API call - in production, this would be a real fetch request
      const response = await fetch("https://api.fundcrane.com/generate-invite", {
        method: "POST", // Corrected syntax: options object with method as string
      })
      const data = await response.json()

      setGeneratedLink(data.invite_link)

      toast({
        title: "Link generated",
        description: "A new invite link has been generated",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate invite link. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const copyGeneratedLink = () => {
    if (!generatedLink) return

    navigator.clipboard.writeText(generatedLink)

    toast({
      title: "Link copied",
      description: "Invite link has been copied to clipboard",
    })
  }

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2 mt-20">
        <h2 className="text-3xl font-bold tracking-tight">Invites</h2>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>General Invite Link</CardTitle>
          <CardDescription>Generate a shareable invite link for multiple potential investors</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex gap-2">
              <Button onClick={generateInviteLink} disabled={isGenerating} className="gap-2">
                <Link2 className="h-4 w-4" />
                {isGenerating ? "Generating..." : "Generate Invite Link"}
              </Button>
            </div>

            {generatedLink && (
              <div className="space-y-4 pt-4">
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="generated-link">Invite Link</Label>
                  <div className="flex gap-2">
                    <Input
                      id="generated-link"
                      value={generatedLink}
                      readOnly
                      onClick={(e) => e.currentTarget.select()}
                    />
                    <Button variant="outline" onClick={copyGeneratedLink}>
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>How to use this link</AlertTitle>
                  <AlertDescription>
                    <ol className="list-decimal pl-4 space-y-1 mt-2">
                      <li>Copy the generated link using the button above</li>
                      <li>Share it with potential investors via email, messaging, etc.</li>
                      <li>When they click the link, they'll be directed to sign up</li>
                      <li>Each link can be used multiple times until manually expired</li>
                    </ol>
                  </AlertDescription>
                </Alert>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Send Individual Invite</CardTitle>
          <CardDescription>Invite a specific investor to join the platform</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <div className="flex gap-2">
                <Input
                  id="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Button onClick={handleSendInvite}>
                  <Send className="mr-2 h-4 w-4" />
                  Send Invite
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Invite History</CardTitle>
          <CardDescription>Manage and track your sent invitations</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Email</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date Sent</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invites.map((invite) => (
                <TableRow key={invite.id}>
                  <TableCell>{invite.email}</TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        invite.status === "Accepted"
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                          : invite.status === "Expired"
                            ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                            : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                      }`}
                    >
                      {invite.status}
                    </span>
                  </TableCell>
                  <TableCell>{invite.created}</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm" onClick={() => copyInviteLink(invite.id)}>
                      <Copy className="h-4 w-4" />
                      <span className="sr-only">Copy invite link</span>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
