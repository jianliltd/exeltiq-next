'use client';
import { useState } from "react";

import { ScheduleHeader } from "./header";
import { ScheduleContent } from "./content";
// import { mockSessions } from "./mock-data";

import { ViewMode } from "../type";
import { format, addWeeks, addMonths, startOfWeek, endOfWeek, startOfMonth } from "date-fns";
import { useTranslation } from "react-i18next";
import { el } from "date-fns/locale";

export const Schedule = () => {
  const { i18n } = useTranslation();
  const [viewMode, setViewMode] = useState<ViewMode>("day");
  const [currentDay, setCurrentDay] = useState(() => {
    return new Date();
  });
  
  const companyId = "";
  const userId = null; 
  const schedules: Array<{
    schedule_date: string | null;
    start_time: string;
    end_time: string;
  }> = [];
  
  // Using mock data for testing - replace with actual API data later
  // const sessions: TodaySession[] = mockSessions;
  
  const loadSchedules = () => {
    // TODO: Reload schedules from API
  };

  // Get current week's Monday
  const currentWeekMonday = startOfWeek(currentDay, { weekStartsOn: 1 });
  
  // Get current month
  const currentMonth = startOfMonth(currentDay);

  // Day navigation handlers
  const goToPreviousDay = () => {
    setCurrentDay(prev => {
      const newDay = new Date(prev);
      newDay.setDate(prev.getDate() - 1);
      return newDay;
    });
  };

  const goToNextDay = () => {
    setCurrentDay(prev => {
      const newDay = new Date(prev);
      newDay.setDate(prev.getDate() + 1);
      return newDay;
    });
  };

  // Week navigation handlers
  const goToPreviousWeek = () => {
    setCurrentDay(prev => addWeeks(prev, -1));
  };

  const goToNextWeek = () => {
    setCurrentDay(prev => addWeeks(prev, 1));
  };

  // Month navigation handlers
  const goToPreviousMonth = () => {
    setCurrentDay(prev => addMonths(prev, -1));
  };

  const goToNextMonth = () => {
    setCurrentDay(prev => addMonths(prev, 1));
  };

  // Format functions
  const formatDay = (date: Date) => {
    const locale = i18n.language === 'el' ? el : undefined;
    return format(date, "EEEE, MMMM d, yyyy", { locale });
  };

  const formatWeekRange = (weekMonday: Date) => {
    const locale = i18n.language === 'el' ? el : undefined;
    const weekStart = weekMonday;
    const weekEnd = endOfWeek(weekMonday, { weekStartsOn: 1 });
    return `${format(weekStart, "MMM d", { locale })} - ${format(weekEnd, "d, yyyy", { locale })}`;
  };

  const formatMonthYear = (date: Date) => {
    const locale = i18n.language === 'el' ? el : undefined;
    return format(date, "MMMM yyyy", { locale });
  };

  // Get current date display based on view mode
  const getCurrentDateDisplay = () => {
    switch (viewMode) {
      case "day":
        return formatDay(currentDay);
      case "week":
        return formatWeekRange(currentWeekMonday);
      case "month":
        return formatMonthYear(currentMonth);
      default:
        return formatDay(currentDay);
    }
  };

  // Handle previous navigation based on view mode
  const handlePrevious = () => {
    switch (viewMode) {
      case "day":
        goToPreviousDay();
        break;
      case "week":
        goToPreviousWeek();
        break;
      case "month":
        goToPreviousMonth();
        break;
    }
  };

  // Handle next navigation based on view mode
  const handleNext = () => {
    switch (viewMode) {
      case "day":
        goToNextDay();
        break;
      case "week":
        goToNextWeek();
        break;
      case "month":
        goToNextMonth();
        break;
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <ScheduleHeader
        companyId={companyId}
        userId={userId}
        schedules={schedules}
        onScheduleAdded={loadSchedules}
      />

      <ScheduleContent
        viewMode={viewMode}
        setViewMode={setViewMode}
        currentDateDisplay={getCurrentDateDisplay()}
        currentDate={currentDay}
        onPreviousClick={handlePrevious}
        onNextClick={handleNext}
      />
    </div>
  );
};
