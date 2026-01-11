"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

interface CalendarStripProps {
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
}

export function CalendarStrip({ selectedDate, onSelectDate }: CalendarStripProps) {
  const today = new Date();
  
  // Get the week containing the selected date
  const getWeekDates = (date: Date) => {
    const dates: Date[] = [];
    const currentDay = date.getDay();
    // Adjust so Monday is 0
    const mondayOffset = currentDay === 0 ? -6 : 1 - currentDay;
    
    for (let i = 0; i < 7; i++) {
      const d = new Date(date);
      d.setDate(date.getDate() + mondayOffset + i);
      dates.push(d);
    }
    return dates;
  };

  const weekDates = getWeekDates(selectedDate);

  const isSameDay = (date1: Date, date2: Date) => {
    return (
      date1.getDate() === date2.getDate() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getFullYear() === date2.getFullYear()
    );
  };

  const formatMonthYear = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <div className="space-y-4">
      <p className="text-muted-foreground text-sm">
        {formatMonthYear(selectedDate)}
      </p>
      
      <div className="flex justify-between">
        {weekDates.map((date, index) => {
          const isSelected = isSameDay(date, selectedDate);
          const isToday = isSameDay(date, today);
          
          return (
            <button
              key={date.toISOString()}
              onClick={() => onSelectDate(date)}
              className="flex flex-col items-center gap-1"
            >
              <span
                className={cn(
                  "text-xs font-medium",
                  isSelected ? "text-foreground" : "text-muted-foreground"
                )}
              >
                {DAYS[index]}
              </span>
              <motion.div
                whileTap={{ scale: 0.9 }}
                className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold transition-colors",
                  isSelected
                    ? "bg-foreground text-background"
                    : isToday
                    ? "bg-primary/20 text-primary"
                    : "text-foreground hover:bg-muted"
                )}
              >
                {date.getDate()}
              </motion.div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
