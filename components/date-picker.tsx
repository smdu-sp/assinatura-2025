// components/date-picker.tsx
"use client"

import * as React from "react"
import { format, getDay, getDaysInMonth, isSameDay, setMonth, setDate, startOfMonth } from "date-fns"
import { ptBR } from "date-fns/locale"
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

interface DatePickerProps {
  value?: string;
  onChange: (dateString: string | undefined) => void;
  disabled?: boolean;
}

export function DatePicker({ value, onChange, disabled }: DatePickerProps) {
  const [open, setOpen] = React.useState(false);
  const baseYear = 2000;

  // Use a data de hoje como valor padrão para evitar inicializações com 'Invalid Date'
  const today = new Date();
  const initialDate = value ? new Date(`${baseYear}-${value}`) : today;

  const [displayDate, setDisplayDate] = React.useState(initialDate);
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(value ? initialDate : undefined);

  const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

  const generateDays = () => {
    const days = [];
    const daysInMonth = getDaysInMonth(displayDate);
    const firstDayOfMonth = startOfMonth(displayDate);
    const startingDayOfWeek = getDay(firstDayOfMonth);

    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(<div key={`empty-${i}`} className="h-8 w-8" />);
    }

    for (let i = 1; i <= daysInMonth; i++) {
      const day = setDate(displayDate, i);
      const isSelected = selectedDate ? isSameDay(day, selectedDate) : false;

      days.push(
        <Button
          key={i}
          variant={isSelected ? 'default' : 'ghost'}
          className="h-8 w-8 p-0 text-sm rounded-full"
          onClick={() => {
            setSelectedDate(day);
            // CORREÇÃO: Garante que o valor enviado é APENAS 'MM-dd'
            onChange(format(day, 'dd-MM'));
            setOpen(false);
          }}
        >
          {i}
        </Button>
      );
    }

    return days;
  };

  const formattedDate = selectedDate
    ? format(selectedDate, "dd 'de' MMMM", { locale: ptBR })
    : "Selecione";

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-full justify-start text-left font-normal bg-background hover:bg-background hover:text-gray-700 border-gray-200",
            !value && "text-gray-700"
          )}
          disabled={disabled}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {formattedDate}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-3">
        <div className="flex justify-between items-center mb-2 bg-white">
          <Button
            variant="ghost"
            className="h-8 w-8 p-0"
            onClick={() => setDisplayDate(setMonth(displayDate, displayDate.getMonth() - 1))}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm font-medium capitalize">
            {format(displayDate, 'MMMM', { locale: ptBR })}
          </span>
          <Button
            variant="ghost"
            className="h-8 w-8 p-0"
            onClick={() => setDisplayDate(setMonth(displayDate, displayDate.getMonth() + 1))}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        <div className="grid grid-cols-7 text-xs text-center text-muted-foreground">
          {weekDays.map(day => (
            <div key={day}>{day}</div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1 mt-2">
          {generateDays()}
        </div>
      </PopoverContent>
    </Popover>
  );
}