"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"

export default function SettingsPage() {
  const { toast } = useToast()
  const [companyName, setCompanyName] = useState("Tech Startup XYZ")
  const [projectDescription, setProjectDescription] = useState("Revolutionizing the future of technology")
  const [fundingGoal, setFundingGoal] = useState("1000000")
  const [minimumInvestment, setMinimumInvestment] = useState("25000")
  const [valuationCap, setValuationCap] = useState("15000000")
  const [discountRate, setDiscountRate] = useState("20")
  // Token-related state variables removed

  const handleSaveGeneral = () => {
    toast({
      title: "Settings saved",
      description: "Your general settings have been updated",
    })
  }

  const handleSaveInvestment = () => {
    toast({
      title: "Settings saved",
      description: "Your investment settings have been updated",
    })
  }

  const handleSaveToken = () => {
    toast({
      title: "Settings saved",
      description: "Your token settings have been updated",
    })
  }

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
      </div>

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="investment">Investment Terms</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>Manage your project's general information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="company-name">Company Name</Label>
                <Input id="company-name" value={companyName} onChange={(e) => setCompanyName(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="project-description">Project Description</Label>
                <Textarea
                  id="project-description"
                  value={projectDescription}
                  onChange={(e) => setProjectDescription(e.target.value)}
                  rows={4}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveGeneral}>Save Changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="investment" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Investment Terms</CardTitle>
              <CardDescription>Configure your fundraising parameters</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="funding-goal">Funding Goal ($)</Label>
                <Input id="funding-goal" value={fundingGoal} onChange={(e) => setFundingGoal(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="minimum-investment">Minimum Investment ($)</Label>
                <Input
                  id="minimum-investment"
                  value={minimumInvestment}
                  onChange={(e) => setMinimumInvestment(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="valuation-cap">Valuation Cap ($)</Label>
                <Input id="valuation-cap" value={valuationCap} onChange={(e) => setValuationCap(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="discount-rate">Discount Rate (%)</Label>
                <Input id="discount-rate" value={discountRate} onChange={(e) => setDiscountRate(e.target.value)} />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveInvestment}>Save Changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

