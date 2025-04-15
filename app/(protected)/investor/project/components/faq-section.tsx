"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface FaqItem {
  question: string
  answer: string
}

export function FaqSection() {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null)

  const faqs: FaqItem[] = [
    {
      question: "What is the minimum investment amount?",
      answer:
        "The minimum investment amount is SGD 5,000. This is structured as a SAFE (Simple Agreement for Future Equity) with a SGD 5,000,000 valuation cap.",
    },
    {
      question: "What round of funding is this?",
      answer: "This is a pre-seed funding round with a target raise of SGD 500,000.",
    },
    {
      question: "How does the SAFE agreement work?",
      answer:
        "A SAFE (Simple Agreement for Future Equity) is an investment instrument that provides rights to the investor for future equity in the company without determining a specific price per share at the time of the initial investment. The SAFE will convert to equity when the company raises a priced round, is acquired, or goes public.",
    },
    {
      question: "What is the expected timeline for a return on investment?",
      answer:
        "While we cannot guarantee specific timelines for returns, our strategic plan includes potential exit opportunities within 5-7 years through acquisition or IPO. However, startup investments are inherently high-risk and long-term.",
    },
    {
      question: "Is my investment eligible for tax benefits?",
      answer:
        "Depending on your jurisdiction and tax situation, your investment may qualify for certain tax benefits. We recommend consulting with your tax advisor for personalized guidance.",
    },
    {
      question: "How will my investment be used?",
      answer:
        "Your investment will primarily be used for product development (40%), expanding our sales and marketing efforts (30%), hiring key team members (20%), and general operational expenses (10%).",
    },
    {
      question: "What rights do I have as an investor?",
      answer:
        "As a SAFE holder, you will receive information rights to quarterly updates. Once converted to equity, you may have additional rights as specified in the SAFE agreement.",
    },
    {
      question: "How will I receive updates about the company's progress?",
      answer:
        "We provide quarterly investor updates via email and host bi-annual investor calls. You'll also have access to this investor portal where we post all relevant documents and announcements.",
    },
    {
      question: "What happens if the company is acquired before the SAFE converts?",
      answer:
        "In the event of an acquisition before conversion, you will have the option to receive either a cash payment equal to your investment amount or convert your SAFE into equity at the valuation cap, whichever would result in a greater return.",
    },
    {
      question: "Is there a deadline for this investment opportunity?",
      answer:
        "This is a rolling close, which means we accept investments on an ongoing basis until we reach our funding target of SGD 500,000.",
    },
  ]

  const toggleFaq = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Frequently Asked Questions</CardTitle>
        <CardDescription>Common questions about investing in HR Monster</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {faqs.map((faq, index) => (
          <div key={index} className="border rounded-md overflow-hidden">
            <button
              onClick={() => toggleFaq(index)}
              className="w-full flex items-center justify-between p-4 text-left font-medium focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              <span>{faq.question}</span>
              {expandedIndex === index ? (
                <ChevronUp className="h-5 w-5 text-muted-foreground" />
              ) : (
                <ChevronDown className="h-5 w-5 text-muted-foreground" />
              )}
            </button>
            {expandedIndex === index && (
              <div className="p-4 pt-0 border-t bg-muted/30">
                <p className="text-muted-foreground">{faq.answer}</p>
              </div>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
