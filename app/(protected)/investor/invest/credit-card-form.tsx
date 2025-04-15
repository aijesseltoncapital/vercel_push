"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { loadStripe } from "@stripe/stripe-js"
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js"

// Use your actual publishable key from environment variable
const stripePromise = loadStripe('pk_test_51R4iYXPTVKsC214hgGS7Hy5x3Nhubrv7DWMAUfihEeWOP0c1fAzV0dO8iK3Lmt16Rlsa81zVAs5t75XKUVeayUdh00jnKZ0OsV')

interface CreditCardFormProps {
  amount: number
  isInstallment?: boolean
  onPaymentComplete: () => void
}

function CreditCardFormContent({
  amount: initialAmount,
  isInstallment = false,
  onPaymentComplete,
}: CreditCardFormProps) {
  const [cardName, setCardName] = useState("")
  const [email, setEmail] = useState("")
  const [amount, setAmount] = useState(initialAmount)
  const [isProcessing, setIsProcessing] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const stripe = useStripe()
  const elements = useElements()

  // Calculate monthly payment
  const calculateMonthlyPayment = () => {
    if (!isInstallment) return amount
    return Math.round((amount / 12) * 100) / 100
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!stripe || !elements) {
      setErrorMessage("Stripe hasn't loaded yet. Please try again.")
      return
    }

    setIsProcessing(true)
    setErrorMessage(null)

    try {
      // Get the card element
      const cardElement = elements.getElement(CardElement)

      if (!cardElement) {
        setErrorMessage("Card details not found")
        setIsProcessing(false)
        return
      }

      // Create payment method
      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: "card",
        card: cardElement,
        billing_details: {
          name: cardName,
          email: email,
        },
      })

      if (error) {
        setErrorMessage(error.message || "Payment method creation failed")
        setIsProcessing(false)
        return
      }

      // Validate amount for installment plans
      if (isInstallment && amount < 1000) {
        setErrorMessage("Minimum installment amount is $1,000")
        setIsProcessing(false)
        return
      }

      // Calculate monthly payment
      const monthlyPayment = calculateMonthlyPayment()

      // Determine payment method based on installment status
      if (isInstallment) {
        // Create FormData for subscription product
        const productFormData = new FormData()
        productFormData.append("amount", Math.round(monthlyPayment * 100).toString())
        productFormData.append("investmentAmount", Math.round(amount * 100).toString())
        productFormData.append("currency", "sgd")
        productFormData.append("customerName", cardName)
        productFormData.append("customerEmail", email)

        const productResponse = await fetch("https://api.fundcrane.com/payments/create-subscription-product", {
          method: "POST",
          body: productFormData,
        })

        if (!productResponse.ok) {
          const errorData = await productResponse.json()
          throw new Error(errorData.message || "Failed to create subscription product")
        }

        const { productId, priceId } = await productResponse.json()

        // Create FormData for subscription
        const subscriptionFormData = new FormData()
        subscriptionFormData.append("priceId", priceId)
        subscriptionFormData.append("customerName", cardName)
        subscriptionFormData.append("customerEmail", email)
        subscriptionFormData.append("paymentMethodType", "card")
        subscriptionFormData.append("paymentMethodID", paymentMethod.id)

        const subscriptionResponse = await fetch("https://api.fundcrane.com/payments/create-subscription", {
          method: "POST",
          body: subscriptionFormData,
        })

        if (!subscriptionResponse.ok) {
          const errorData = await subscriptionResponse.json()
          throw new Error(errorData.message || "Failed to create subscription")
        }

        const { subscriptionId, clientSecret } = await subscriptionResponse.json()

        // Confirm the subscription payment method
        const { error: confirmError } = await stripe.confirmCardPayment(clientSecret, {
          payment_method: {
            card: cardElement,
            billing_details: {
              name: cardName,
              email: email,
            },
          },
        })

        if (confirmError) {
          setErrorMessage(confirmError.message || "Subscription confirmation failed")
          setIsProcessing(false)
        } else {
          // Simulate payment processing
          setTimeout(() => {
            setIsProcessing(false)
            onPaymentComplete()
          }, 1000)
        }
      } else {
        // One-time payment logic with FormData
        const paymentFormData = new FormData()
        paymentFormData.append("amount", Math.round(amount * 100).toString())
        paymentFormData.append("currency", "sgd")
        paymentFormData.append("paymentMethodID", paymentMethod.id)
        paymentFormData.append("customerName", cardName)
        paymentFormData.append("customerEmail", email)

        const response = await fetch("https://api.fundcrane.com/payments/create-payment-intent", {
          method: "POST",
          body: paymentFormData,
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.message || "Failed to create payment intent")
        }

        const { clientSecret } = await response.json()

        // Confirm the payment on the client side
        const { error: confirmError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
          payment_method: {
            card: cardElement,
            billing_details: {
              name: cardName,
              email: email,
            },
          },
        })

        if (confirmError) {
          setErrorMessage(confirmError.message || "Payment failed")
          setIsProcessing(false)
        } else if (paymentIntent) {
          // Simulate payment processing
          setTimeout(() => {
            setIsProcessing(false)
            onPaymentComplete()
          }, 1000)
        }
      }
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "An unexpected error occurred")
      setIsProcessing(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Credit Card Payment</CardTitle>
        <CardDescription>
          {isInstallment
            ? "Enter your card details for your first monthly payment"
            : "Enter your card details to complete the payment"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {isInstallment && (
            <div className="space-y-2">
              <Label htmlFor="total-amount">Total Investment Amount</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                <Input
                  id="total-amount"
                  type="number"
                  className="pl-8"
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  min={1000}
                  step={100}
                />
              </div>
              <p className="text-sm text-muted-foreground">
                Minimum investment: $1,000. First monthly payment will be ${calculateMonthlyPayment().toLocaleString()}
              </p>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="cardName">Name on Card</Label>
            <Input
              id="cardName"
              placeholder="John Doe"
              value={cardName}
              onChange={(e) => setCardName(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              placeholder="john.doe@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Card Details</Label>
            <div className="p-3 border rounded-md">
              <CardElement
                options={{
                  style: {
                    base: {
                      fontSize: "16px",
                      color: "#424770",
                      "::placeholder": {
                        color: "#aab7c4",
                      },
                    },
                    invalid: {
                      color: "#9e2146",
                    },
                  },
                }}
              />
            </div>
          </div>

          {errorMessage && <div className="text-sm font-medium text-destructive">{errorMessage}</div>}

          <div className="pt-2">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-muted-foreground">{isInstallment ? "First Monthly Payment:" : "Amount:"}</span>
              <span className="font-medium">
                ${isInstallment ? calculateMonthlyPayment().toLocaleString() : amount.toLocaleString()}
              </span>
            </div>
            <Button type="submit" className="w-full" disabled={isProcessing || !stripe}>
              {isProcessing ? (
                <>
                  <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent"></span>
                  Processing...
                </>
              ) : isInstallment ? (
                `Pay First Installment: $${calculateMonthlyPayment().toLocaleString()}`
              ) : (
                `Pay $${amount.toLocaleString()}`
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

export function CreditCardForm(props: CreditCardFormProps) {
  return (
    <Elements stripe={stripePromise}>
      <CreditCardFormContent {...props} />
    </Elements>
  )
}
