import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function ImportantDatesCard() {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle>Important Dates</CardTitle>
        <CardDescription>Key dates for this investment round</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between">
            <span className="text-sm font-medium">Round Opens</span>
            <span className="text-sm text-muted-foreground">May 1, 2023</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm font-medium">Round Closes</span>
            <span className="text-sm text-muted-foreground">July 31, 2023</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm font-medium">Expected Close Date</span>
            <span className="text-sm text-muted-foreground">August 15, 2023</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

