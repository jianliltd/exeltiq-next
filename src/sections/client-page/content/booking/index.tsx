'use client';

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { BookingHeader } from "./header";
import { BookingContent } from "./content";
import { format, addDays, addWeeks, addMonths, startOfWeek, startOfMonth, endOfMonth, isSameMonth } from "date-fns";

interface Booking {
  id: string;
  schedule_date: string;
  start_time: string;
  end_time: string;
}

interface Schedule {
  id: string;
  schedule_date: string;
  start_time: string;
  end_time: string;
  max_capacity: number;
}

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export const Booking = () => {
  const [viewMode, setViewMode] = useState<"day" | "week" | "month">("day");
  const [currentDay, setCurrentDay] = useState(new Date());
  const [currentWeekMonday, setCurrentWeekMonday] = useState(startOfWeek(new Date(), { weekStartsOn: 1 }));
  const [currentMonth, setCurrentMonth] = useState(startOfMonth(new Date()));
  
  // Helper to get today's date key
  const todayKey = format(new Date(), "yyyy-MM-dd");
  const tomorrowKey = format(addDays(new Date(), 1), "yyyy-MM-dd");
  const dayAfterKey = format(addDays(new Date(), 2), "yyyy-MM-dd");
  
  // Mock data states - Small dataset for testing
  const [myBookings, setMyBookings] = useState<Booking[]>([
    {
      id: "b1",
      schedule_date: todayKey,
      start_time: "14:00:00",
      end_time: "15:00:00"
    }
  ]);
  
  const [currentDaySchedules, setCurrentDaySchedules] = useState<Schedule[]>([
    {
      id: "s1",
      schedule_date: todayKey,
      start_time: "09:00:00",
      end_time: "10:00:00",
      max_capacity: 12
    },
    {
      id: "s2",
      schedule_date: todayKey,
      start_time: "14:00:00",
      end_time: "15:00:00",
      max_capacity: 10
    },
    {
      id: "s3",
      schedule_date: todayKey,
      start_time: "18:00:00",
      end_time: "19:00:00",
      max_capacity: 15
    }
  ]);
  
  const [currentWeekSchedules, setCurrentWeekSchedules] = useState<Record<string, Schedule[]>>({
    [todayKey]: [
      { id: "s1", schedule_date: todayKey, start_time: "09:00:00", end_time: "10:00:00", max_capacity: 12 },
      { id: "s2", schedule_date: todayKey, start_time: "14:00:00", end_time: "15:00:00", max_capacity: 10 },
    ],
    [tomorrowKey]: [
      { id: "s4", schedule_date: tomorrowKey, start_time: "10:00:00", end_time: "11:00:00", max_capacity: 8 },
      { id: "s5", schedule_date: tomorrowKey, start_time: "17:00:00", end_time: "18:00:00", max_capacity: 12 },
    ]
  });
  
  const [currentMonthSchedules, setCurrentMonthSchedules] = useState<Record<string, Schedule[]>>({
    [todayKey]: [
      { id: "s1", schedule_date: todayKey, start_time: "09:00:00", end_time: "10:00:00", max_capacity: 12 },
      { id: "s2", schedule_date: todayKey, start_time: "14:00:00", end_time: "15:00:00", max_capacity: 10 },
    ],
    [tomorrowKey]: [
      { id: "s4", schedule_date: tomorrowKey, start_time: "10:00:00", end_time: "11:00:00", max_capacity: 8 },
    ],
    [dayAfterKey]: [
      { id: "s6", schedule_date: dayAfterKey, start_time: "11:00:00", end_time: "12:00:00", max_capacity: 15 },
      { id: "s7", schedule_date: dayAfterKey, start_time: "16:00:00", end_time: "17:00:00", max_capacity: 10 },
    ]
  });
  
  const [clientData, setClientData] = useState<{ sessions_remaining?: number }>({ sessions_remaining: 8 });

  // Loading states
  const [isCancelBooking, setIsCancelBooking] = useState({ loading: false, key: null as string | null });
  const [isCancelingWaitlist, setIsCancelingWaitlist] = useState({ loading: false, key: null as string | null });
  const [isBooking, setIsBooking] = useState({ loading: false, key: null as string | null });
  const [isJoiningWaitlist, setIsJoiningWaitlist] = useState({ loading: false, key: null as string | null });

  // Navigation functions
  const goToPreviousDay = () => setCurrentDay(addDays(currentDay, -1));
  const goToNextDay = () => setCurrentDay(addDays(currentDay, 1));
  const goToPreviousWeek = () => setCurrentWeekMonday(addWeeks(currentWeekMonday, -1));
  const goToNextWeek = () => setCurrentWeekMonday(addWeeks(currentWeekMonday, 1));
  const goToPreviousMonth = () => setCurrentMonth(addMonths(currentMonth, -1));
  const goToNextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));

  // Format functions
  const formatDay = (date: Date) => format(date, "EEEE, MMMM d, yyyy");
  const formatWeekRange = (date: Date) => {
    const weekEnd = addDays(date, 6);
    return `${format(date, "MMM d")} - ${format(weekEnd, "MMM d, yyyy")}`;
  };
  const formatMonthYear = (date: Date) => format(date, "MMMM yyyy");
  const formatDateKey = (date: Date) => format(date, "yyyy-MM-dd");

  // Generate days for week view
  const daysOfCurrentWeek = Array.from({ length: 7 }, (_, i) => {
    const date = addDays(currentWeekMonday, i);
    return {
      dateStr: formatDateKey(date),
      dayName: format(date, "EEEE"),
      formatted: format(date, "MMM d"),
      date,
    };
  });

  // Generate days for month view
  const daysOfCurrentMonth = (() => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    const startDate = startOfWeek(monthStart, { weekStartsOn: 0 });
    const endDate = addDays(monthEnd, 6 - monthEnd.getDay());
    
    const days = [];
    let currentDate = startDate;
    
    while (currentDate <= endDate) {
      days.push({
        dateStr: formatDateKey(currentDate),
        dayNumber: currentDate.getDate(),
        isCurrentMonth: isSameMonth(currentDate, currentMonth),
        isToday: formatDateKey(currentDate) === formatDateKey(new Date()),
        date: new Date(currentDate),
      });
      currentDate = addDays(currentDate, 1);
    }
    
    return days;
  })();

  // Handler functions
  const handleCancelBooking = async (id: string) => {
    setIsCancelBooking({ loading: true, key: id });
    // Simulate API call
    setTimeout(() => {
      setMyBookings(prev => prev.filter(b => b.id !== id));
      setIsCancelBooking({ loading: false, key: null });
    }, 1000);
  };

  const handleCancelWaitlist = async (id: string) => {
    setIsCancelingWaitlist({ loading: true, key: id });
    // Simulate API call
    setTimeout(() => {
      setIsCancelingWaitlist({ loading: false, key: null });
    }, 1000);
  };

  const handleBookSlot = async (schedule: Schedule) => {
    setIsBooking({ loading: true, key: schedule.id });
    // Simulate API call
    setTimeout(() => {
      const newBooking: Booking = {
        id: `b${Date.now()}`,
        schedule_date: schedule.schedule_date,
        start_time: schedule.start_time,
        end_time: schedule.end_time
      };
      setMyBookings(prev => [...prev, newBooking]);
      setIsBooking({ loading: false, key: null });
    }, 1000);
  };

  const handleJoinWaitlist = async (schedule: Schedule) => {
    setIsJoiningWaitlist({ loading: true, key: schedule.id });
    // Simulate API call
    setTimeout(() => {
      setIsJoiningWaitlist({ loading: false, key: null });
    }, 1000);
  };

  const canGetRefund = (date: string, time: string): boolean => {
    // Add your refund eligibility logic here
    const sessionDateTime = new Date(`${date}T${time}`);
    const now = new Date();
    const hoursUntilSession = (sessionDateTime.getTime() - now.getTime()) / (1000 * 60 * 60);
    return hoursUntilSession >= 24;
  };

  // Helper functions for booking counts and waitlist
  const getBookingCount = (date: string, time: string): number => {
    // Mock booking counts
    const mockCounts: Record<string, number> = {
      [`${todayKey}_09:00:00`]: 8,
      [`${todayKey}_14:00:00`]: 7,
      [`${todayKey}_18:00:00`]: 12,
      [`${tomorrowKey}_10:00:00`]: 5,
      [`${tomorrowKey}_17:00:00`]: 9,
      [`${dayAfterKey}_11:00:00`]: 3,
      [`${dayAfterKey}_16:00:00`]: 6,
    };
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const _unused = { date, time };
    return mockCounts[`${date}_${time}`] || 0;
  };

  const getWaitlistPosition = (date: string, time: string): number | null => {
    // Mock waitlist positions - return null if not on waitlist
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const _unused = { date, time };
    return null;
  };

  const getWaitlistId = (date: string, time: string): string | null => {
    // Mock waitlist IDs
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const _unused = { date, time };
    return null;
  };

  const getWaitlistCount = (date: string, time: string): number => {
    // Mock waitlist counts for full sessions
    const mockWaitlist: Record<string, number> = {
      [`${todayKey}_18:00:00`]: 3,
    };
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const _unused = { date, time };
    return mockWaitlist[`${date}_${time}`] || 0;
  };

  return (
    <Card>
      <BookingHeader 
        viewMode={viewMode}
        setViewMode={setViewMode}
        currentDay={currentDay}
        currentWeekMonday={currentWeekMonday}
        currentMonth={currentMonth}
        goToPreviousDay={goToPreviousDay}
        goToNextDay={goToNextDay}
        goToPreviousWeek={goToPreviousWeek}
        goToNextWeek={goToNextWeek}
        goToPreviousMonth={goToPreviousMonth}
        goToNextMonth={goToNextMonth}
        formatDay={formatDay}
        formatWeekRange={formatWeekRange}
        formatMonthYear={formatMonthYear}
        clientData={clientData}
      />
      <BookingContent 
        viewMode={viewMode}
        currentDay={currentDay}
        currentDaySchedules={currentDaySchedules}
        daysOfCurrentWeek={daysOfCurrentWeek}
        currentWeekSchedules={currentWeekSchedules}
        daysOfCurrentMonth={daysOfCurrentMonth}
        currentMonthSchedules={currentMonthSchedules}
        myBookings={myBookings}
        isCancelBooking={isCancelBooking}
        isCancelingWaitlist={isCancelingWaitlist}
        isBooking={isBooking}
        isJoiningWaitlist={isJoiningWaitlist}
        handleCancelBooking={handleCancelBooking}
        handleCancelWaitlist={handleCancelWaitlist}
        handleBookSlot={handleBookSlot}
        handleJoinWaitlist={handleJoinWaitlist}
        canGetRefund={canGetRefund}
        getBookingCount={getBookingCount}
        getWaitlistPosition={getWaitlistPosition}
        getWaitlistId={getWaitlistId}
        getWaitlistCount={getWaitlistCount}
        formatDateKey={formatDateKey}
        DAYS={DAYS}
      />
    </Card>
  );
};
