"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useAuth } from "@/lib/auth-provider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { login } = useAuth()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      await login(email, password)
      toast({
        title: "Login successful",
        description: "Welcome back to the platform.",
      })
    } catch (error) {
      toast({
        title: "Login failed",
        description: "Please check your credentials and try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDemoLogin = async (demoType: string) => {
    setIsLoading(true)
    try {
      if (demoType === "admin") {
        await login("admin@example.com", "password")
      } else if (demoType === "investor") {
        await login("investor@example.com", "password")
      } else if (demoType === "new-investor") {
        await login("new-investor@example.com", "password")
      }

      toast({
        title: "Demo login successful",
        description: "You are now logged in as a demo user.",
      })
    } catch (error) {
      toast({
        title: "Login failed",
        description: "There was an error logging in with the demo account.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Sign in</CardTitle>
          <CardDescription>Enter your credentials to access the platform</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link href="/forgot-password" className="text-sm text-primary underline-offset-4 hover:underline">
                  Forgot password?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Signing in..." : "Sign in"}
            </Button>

            <Tabs defaultValue="admin" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="admin">Admin</TabsTrigger>
                <TabsTrigger value="investor">Investor</TabsTrigger>
                <TabsTrigger value="new-investor">New Investor</TabsTrigger>
              </TabsList>
              <TabsContent value="admin" className="space-y-2">
                <p className="text-xs text-muted-foreground text-center">Admin account with full access</p>
                <Button variant="outline" className="w-full" onClick={() => handleDemoLogin("admin")}>
                  Login as Admin
                </Button>
              </TabsContent>
              <TabsContent value="investor" className="space-y-2">
                <p className="text-xs text-muted-foreground text-center">Investor with KYC approval</p>
                <Button variant="outline" className="w-full" onClick={() => handleDemoLogin("investor")}>
                  Login as Approved Investor
                </Button>
              </TabsContent>
              <TabsContent value="new-investor" className="space-y-2">
                <p className="text-xs text-muted-foreground text-center">Investor without KYC approval</p>
                <Button variant="outline" className="w-full" onClick={() => handleDemoLogin("new-investor")}>
                  Login as New Investor
                </Button>
              </TabsContent>
            </Tabs>

            <div className="text-sm text-center text-muted-foreground">
              Don't have an account?{" "}
              <Link href="/signup" className="text-primary underline-offset-4 hover:underline">
                Create Account
              </Link>
            </div>
            <div className="text-sm text-center text-muted-foreground">
              <Link href="/" className="text-primary underline-offset-4 hover:underline">
                Back to home
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

