"use client";

import { useState, useEffect, useCallback } from "react";

export type TimeOfDay = "day" | "night";

export function useTimeOfDay() {
  const getTimeOfDay = useCallback((): TimeOfDay => {
    const hour = new Date().getHours();
    // Day is 6 AM to 6 PM
    return hour >= 6 && hour < 18 ? "day" : "night";
  }, []);

  const [timeOfDay, setTimeOfDay] = useState<TimeOfDay>(getTimeOfDay);

  useEffect(() => {
    // Update immediately
    setTimeOfDay(getTimeOfDay());

    // Check every minute for time changes
    const interval = setInterval(() => {
      setTimeOfDay(getTimeOfDay());
    }, 60000);

    return () => clearInterval(interval);
  }, [getTimeOfDay]);

  return {
    timeOfDay,
    isDay: timeOfDay === "day",
    isNight: timeOfDay === "night",
  };
}
