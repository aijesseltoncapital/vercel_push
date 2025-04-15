"use client"

import { useState } from "react"
import { format } from "date-fns"
import { CalendarIcon, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"

interface DatePickerProps {
  value: string
  onChange: (date: string) => void
}

export function DatePicker({ value, onChange }: DatePickerProps) {
  const [date, setDate] = useState<Date | undefined>(value ? new Date(value) : undefined)
  const [isRollingClose, setIsRollingClose] = useState<boolean>(value === "rolling-close")

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal",
            !date && !isRollingClose && "text-muted-foreground",
          )}
        >
          {isRollingClose ? (
            <>
              <Clock className="mr-2 h-4 w-4" />
              <span>Rolling Close</span>
            </>
          ) : (
            <>
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? format(date, "PPP") : <span>Pick a date</span>}
            </>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-4">
        <div className="space-y-4">
          <RadioGroup
            defaultValue={isRollingClose ? "rolling" : "specific"}
            onValueChange={(value) => {
              if (value === "rolling") {
                setIsRollingClose(true)
                setDate(undefined)
                onChange("rolling-close")
              } else {
                setIsRollingClose(false)
              }
            }}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="specific" id="specific" />
              <Label htmlFor="specific">Specific Date</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="rolling" id="rolling" />
              <Label htmlFor="rolling">Rolling Close</Label>
            </div>
          </RadioGroup>

          {!isRollingClose && (
            <Calendar
              mode="single"
              selected={date}
              onSelect={(newDate) => {
                setDate(newDate)
                if (newDate) {
                  onChange(newDate.toISOString())
                }
              }}
              initialFocus
            />
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}
