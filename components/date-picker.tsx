// components/day-month-picker.tsx
"use client"

import * as React from "react"
import { format, parseISO } from "date-fns"
import { ptBR } from "date-fns/locale"
import { Calendar as CalendarIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import "./calendar-noyear.css"

interface DatePickerProps {
  value?: Date;
  onChange: (date: Date | undefined) => void;
  disabled?: boolean;
}

export function DatePicker({ value, onChange, disabled }: DatePickerProps) {
    const initialDate = value || new Date();
    const [date, setDate] = React.useState<Date | undefined>(value);

  // Quando a data muda, chama a função onChange com a nova data
  const handleDateChange = (newDate: Date | undefined) => {
    setDate(newDate);
    onChange(newDate);
  }

  // Formata a data para exibir "dia de mês" (ex: 01 de julho)
  const formattedDate = date 
    ? format(date, "dd 'de' MMMM", { locale: ptBR })
    : "Selecione";

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-full justify-start text-left font-normal bg-white text-gray-900 hover:bg-white hover:text-gray-900",
            !date && "text-muted-foreground"
          )}
          disabled={disabled}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {formattedDate}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={date}
          onSelect={handleDateChange}
          initialFocus
          locale={ptBR}
          captionLayout="dropdown"
          fromYear={1900}
          toYear={2100}
        />
      </PopoverContent>
    </Popover>
  )
}