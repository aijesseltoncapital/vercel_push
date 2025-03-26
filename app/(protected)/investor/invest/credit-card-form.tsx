"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CreditCard, Calendar, Lock } from "lucide-react"
import { loadStripe } from '@stripe/stripe-js'
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js'

// Use your actual publishable key
const stripePromise = loadStripe('pk_test_51R4iYPAhgvaDYyxUCBwIFtjR4gaWm1Jm25zyOgVl5XH2Gof04lVlCp60WwtNYTWzJrDaIrwa0SlqaIfNfI7SbP4Y00gsvxFoCC')

interface CreditCardFormProps {
  initialAmount: number
  isInstallment: boolean
  onPaymentComplete: (paymentDetails: {
    subscriptionId?: string, 
    paymentIntentId?: string, 
    amount: number, 
    monthlyPayment: number
  }) => void
  onPaymentError: (error: string) => void
}

function CreditCardFormContent({ 
  initialAmount, 
  isInstallment, 
  onPaymentComplete, 
  onPaymentError 
}: CreditCardFormProps) {
  const [cardName, setCardName] = useState("")
  const [amount, setAmount] = useState(initialAmount)
  const [isProcessing, setIsProcessing] = useState(false)
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
      return
    }

    setIsProcessing(true)

    try {
      // Get the card element
      const cardElement = elements.getElement(CardElement)
      
      if (!cardElement) {
        onPaymentError('Card details not found')
        setIsProcessing(false)
        return
      }

      // Create payment method
      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
        billing_details: {
          name: cardName
        }
      })

      if (error) {
        onPaymentError(error.message || 'Payment method creation failed')
        setIsProcessing(false)
        return
      }

      // Validate amount
      if (isInstallment && amount < 1000) {
        onPaymentError("Minimum installment amount is $1,000")
        setIsProcessing(false)
        return
      }

      // Calculate monthly payment
      const monthlyPayment = calculateMonthlyPayment()

      // Determine payment method based on installment status
      if (isInstallment) {
        // Create Stripe Product and Price for the subscription
        const productResponse = await fetch('/api/create-subscription-product', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ 
            amount: Math.round(monthlyPayment * 100), // Convert to cents
            investmentAmount: Math.round(amount * 100),
            currency: 'sgd',
            customerName: cardName
          })
        })

        const { productId, priceId } = await productResponse.json()

        // Create Customer and Subscription
        const subscriptionResponse = await fetch('/api/create-subscription', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ 
            priceId,
            customerName: cardName,
            paymentMethodType: 'card',
            paymentMethodID: paymentMethod.id
          })
        })

        const { 
          subscriptionId, 
          clientSecret 
        } = await subscriptionResponse.json()

        // Confirm the subscription payment method
        const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
          payment_method: {
            card: elements.getElement(CardElement)!,
            billing_details: {
              name: cardName
            }
          }
        })

        if (error) {
          onPaymentError(error.message || 'Subscription creation failed')
          setIsProcessing(false)
        } else {
          onPaymentComplete({
            subscriptionId,
            amount: amount,
            monthlyPayment: monthlyPayment
          })
        }
      } else {
        // Existing one-time payment logic
        const response = await fetch('/api/create-payment-intent', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ 
            amount: Math.round(amount * 100), // Convert to cents
            currency: 'sgd',
            payment_method_types: ['card'],
            metadata: {
              customerName: cardName
            }
          })
        })

        const { clientSecret } = await response.json()

        // Confirm the payment on the client side
        const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
          payment_method: {
            card: elements.getElement(CardElement)!,
            billing_details: {
              name: cardName
            }
          }
        })

        if (error) {
          onPaymentError(error.message || 'Payment failed')
          setIsProcessing(false)
        } else if (paymentIntent) {
          onPaymentComplete({
            paymentIntentId: paymentIntent.id,
            amount: amount,
            monthlyPayment: monthlyPayment
          })
        }
      }
    } catch (error) {
      onPaymentError('An unexpected error occurred')
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
            <Label>Card Details</Label>
            <div className="p-3 border rounded-md">
              <CardElement 
                options={{
                  style: {
                    base: {
                      fontSize: '16px',
                      color: '#424770',
                      '::placeholder': {
                        color: '#aab7c4',
                      },
                    },
                    invalid: {
                      color: '#9e2146',
                    },
                  },
                }}
              />
            </div>
          </div>

          <div className="pt-2">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-muted-foreground">
                {isInstallment 
                  ? "First Monthly Payment:" 
                  : "Total Amount:"}
              </span>
              <span className="font-medium">
                ${isInstallment 
                  ? calculateMonthlyPayment().toLocaleString() 
                  : amount.toLocaleString()}
              </span>
            </div>
            <Button 
              type="submit" 
              className="w-full" 
              disabled={isProcessing || !stripe}
            >
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