"use client";

import * as React from "react";
import { ChevronDownIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface Calendar24Props {
  onChange?: (value: string) => void;
  dateValue?: Date;
  timeValue?: string;
}

export function Calendar24({ onChange, dateValue, timeValue }: Calendar24Props) {
  const [open, setOpen] = React.useState(false);
  const [date, setDate] = React.useState<Date | undefined>(dateValue);
  const [time, setTime] = React.useState(timeValue || "10:30:00");

  const formatDateTime = (selectedDate: Date | undefined, selectedTime: string) => {
    if (!selectedDate) return "";
    
    const yyyy = selectedDate.getFullYear();
    const MM = String(selectedDate.getMonth() + 1).padStart(2, "0");
    const dd = String(selectedDate.getDate()).padStart(2, "0");
    
    return `${yyyy}-${MM}-${dd} ${selectedTime}`;
  };

  const handleDateChange = (newDate: Date | undefined) => {
    setDate(newDate);
    setOpen(false);
    
    if (newDate && onChange) {
      const formatted = formatDateTime(newDate, time);
      onChange(formatted);
    }
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = e.target.value;
    setTime(newTime);
    
    if (date && onChange) {
      const formatted = formatDateTime(date, newTime);
      onChange(formatted);
    }
  };

  return (
    <div className="">
      <div className="flex flex-col gap-3">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <div className="flex items-center gap-3 h-10 w-full rounded-lg px-[15px] py-2 border border-stroke-line">
              <button
                type="button"
                id="date-picker"
                className="w-full justify-between font-normal flex items-center gap-2"
              >
                {date ? date.toLocaleDateString() : "Огноо сонгоно уу"}
                <ChevronDownIcon size={16} />
              </button>
              <input
                type="time"
                id="time-picker"
                step="1"
                value={time}
                onChange={handleTimeChange}
                className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none ring-0 outline-none"
              />
            </div>
          </PopoverTrigger>
          <PopoverContent
            className="w-auto p-1 bg-background z-150"
            align="start"
          >
            <Calendar
              mode="single"
              selected={date}
              captionLayout="dropdown"
              onSelect={handleDateChange}
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}