"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"

export default function OnboardingPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [step, setStep] = useState(1)
  const [investorType, setInvestorType] = useState("individual")
  const [accredited, setAccredited] = useState(false)

  const handleContinue = () => {
    if (step < 3) {
      setStep(step + 1)
    } else {
      // In a real app, this would submit the onboarding information
      toast({
        title: "Onboarding complete",
        description: "Your account has been set up successfully",
      })
      router.push("/investor/dashboard")
    }
  }

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-muted/40 p-4">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle>Complete Your Profile</CardTitle>
          <CardDescription>
            {step === 1 && "Tell us about yourself"}
            {step === 2 && "Investor accreditation"}
            {step === 3 && "Investment preferences"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {step === 1 && (
            <>
              <div className="space-y-2">
                <Label>Investor Type</Label>
                <RadioGroup value={investorType} onValueChange={setInvestorType}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="individual" id="individual" />
                    <Label htmlFor="individual">Individual</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="entity" id="entity" />
                    <Label htmlFor="entity">Entity (Company, Trust, etc.)</Label>
                  </div>
                </RadioGroup>
              </div>

              {investorType === "individual" && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="full-name">Full Legal Name</Label>
                    <Input id="full-name" placeholder="John Doe" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input id="phone" placeholder="+1 (555) 123-4567" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="country">Country of Residence</Label>
                      <Input id="country" placeholder="United States" />
                    </div>
                  </div>
                </>
              )}

              {investorType === "entity" && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="entity-name">Entity Name</Label>
                    <Input id="entity-name" placeholder="Acme Corporation" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="entity-type">Entity Type</Label>
                    <Input id="entity-type" placeholder="Corporation, LLC, Trust, etc." />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="contact-name">Contact Person</Label>
                      <Input id="contact-name" placeholder="Jane Smith" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="entity-country">Country of Formation</Label>
                      <Input id="entity-country" placeholder="United States" />
                    </div>
                  </div>
                </>
              )}
            </>
          )}

          {step === 2 && (
            <>
              <div className="space-y-2">
                <Label>Accredited Investor Status</Label>
                <p className="text-sm text-muted-foreground mb-4">
                  Under U.S. securities laws, only accredited investors may participate in certain securities offerings.
                  Please confirm your accredited investor status.
                </p>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="accredited"
                    checked={accredited}
                    onCheckedChange={(checked) => setAccredited(checked === true)}
                  />
                  <label htmlFor="accredited" className="text-sm font-medium leading-none">
                    I certify that I am an accredited investor
                  </label>
                </div>
              </div>

              <div className="space-y-2 mt-4">
                <Label>Accreditation Criteria (select all that apply)</Label>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="income" />
                    <label htmlFor="income" className="text-sm font-medium leading-none">
                      Income exceeding $200,000 (or $300,000 with spouse) in each of the prior two years
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="net-worth" />
                    <label htmlFor="net-worth" className="text-sm font-medium leading-none">
                      Net worth over $1 million, excluding primary residence
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="professional" />
                    <label htmlFor="professional" className="text-sm font-medium leading-none">
                      Professional certification, designation, or credentials
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="entity-criteria" />
                    <label htmlFor="entity-criteria" className="text-sm font-medium leading-none">
                      Entity with all equity owners being accredited investors
                    </label>
                  </div>
                </div>
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <div className="space-y-2">
                <Label>Investment Experience</Label>
                <RadioGroup defaultValue="experienced">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="beginner" id="beginner" />
                    <Label htmlFor="beginner">Beginner (0-2 years)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="intermediate" id="intermediate" />
                    <Label htmlFor="intermediate">Intermediate (3-5 years)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="experienced" id="experienced" />
                    <Label htmlFor="experienced">Experienced (5+ years)</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-2 mt-4">
                <Label>Investment Interests (select all that apply)</Label>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="equity" defaultChecked />
                    <label htmlFor="equity" className="text-sm font-medium leading-none">
                      Equity (SAFE, Convertible Notes)
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="tokens" defaultChecked />
                    <label htmlFor="tokens" className="text-sm font-medium leading-none">
                      Utility Tokens
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="debt" />
                    <label htmlFor="debt" className="text-sm font-medium leading-none">
                      Debt Instruments
                    </label>
                  </div>
                </div>
              </div>

              <div className="space-y-2 mt-4">
                <Label htmlFor="investment-amount">Typical Investment Amount</Label>
                <Input id="investment-amount" placeholder="$25,000 - $100,000" />
              </div>
            </>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          {step > 1 ? (
            <Button variant="outline" onClick={handleBack}>
              Back
            </Button>
          ) : (
            <div></div>
          )}
          <Button onClick={handleContinue}>{step < 3 ? "Continue" : "Complete"}</Button>
        </CardFooter>
      </Card>
    </div>
  )
}

