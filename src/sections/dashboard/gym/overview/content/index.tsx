import { CardContent } from "@/components/ui/card";

import { BookingDayView } from "./day/booking-view";
import { BookingWeekView } from "./week/booking-view";
import { BookingMonthView } from "./month/booking-view";
import { WaitingDayView } from "./day/waiting-view";
import { WaitingWeekView } from "./week/waiting-view";
import { WaitingMonthView } from "./month/waiting-view";

import { TabMode, TodaySession, ViewMode, WaitlistEntry } from "../../type";
import { format, parseISO } from "date-fns";

type OverviewContentProps = {
  viewMode: ViewMode;
  tabMode: TabMode;
  currentDate: Date;
  sessions: TodaySession[];
  editingNotes: string | null;
  setEditingNotes: (editingNotes: string | null) => void;
  notes: string | null;
  setNotes: (notes: string | null) => void;
  setCurrentDate: (date: Date) => void;
  setViewMode: (viewMode: ViewMode) => void;
  waitlist: WaitlistEntry[];
}

export const OverviewContent = ({ viewMode, tabMode, currentDate,  sessions,  editingNotes, setEditingNotes, notes, setNotes,    setCurrentDate, setViewMode, waitlist }: OverviewContentProps) => {
    
  const getSessionsForDate = (date: Date) => {
    const dateStr = format(date, "yyyy-MM-dd");
    return sessions.filter((session) => session.schedule_date === dateStr);
  };

  const groupSessionsByTimeSlot = (daySessions: TodaySession[]) => {
    const grouped: { [key: string]: TodaySession[] } = {};
    daySessions.forEach((session) => {
      const timeKey = `${session.start_time}-${session.end_time}`;
      if (!grouped[timeKey]) {
        grouped[timeKey] = [];
      }
      grouped[timeKey].push(session);
    });
    return grouped;
  };
  
  const getWaitlistForDate = (date: Date) => {
    const dateStr = format(date, "yyyy-MM-dd");
    return waitlist.filter((entry) => entry.schedule_date === dateStr);
  };

  const groupWaitlistByTimeSlot = (dayWaitlist: WaitlistEntry[]) => {
    const grouped: { [key: string]: WaitlistEntry[] } = {};
    dayWaitlist.forEach((entry) => {
      if (entry.schedule) {
        const timeKey = `${entry.schedule.start_time}-${entry.schedule.end_time}`;
        if (!grouped[timeKey]) {
          grouped[timeKey] = [];
        }
        grouped[timeKey].push(entry);
      }
    });
    return grouped;
  };

  const handlePromoteFromWaitlist = async (entry: WaitlistEntry) => {
    console.log(entry);
    // we need to implement the promote from waitlist logic here with the API
  };

  const handleRemoveFromWaitlist = async (entryId: string) => {
    console.log(entryId);
    // we need to implement the remove from waitlist logic here with the API
  };

  
  const handleCancelSession = async (sessionId: string) => {
    console.log(sessionId);
    // we need to implement the cancel session logic here with the API
  };

  const handleSaveNotes = async (sessionId: string) => {
    console.log(sessionId);
    // we need to implement the save notes logic here with the API
  };

  const isSessionInFuture = (scheduleDate: string, startTime: string) => {
    const sessionDateTime = parseISO(`${scheduleDate}T${startTime}`);
    return sessionDateTime > new Date();
  };

  return (
    <CardContent>
        {tabMode === "bookings" ? (
          <>
            {viewMode === "day" && (
              <BookingDayView
                currentDate={currentDate}
                getSessionsForDate={getSessionsForDate}
                groupSessionsByTimeSlot={groupSessionsByTimeSlot}
                editingNotes={editingNotes}
                setEditingNotes={setEditingNotes}
                notes={notes}
                setNotes={setNotes}
                handleCancelSession={handleCancelSession}
                isSessionInFuture={isSessionInFuture}
                handleSaveNotes={handleSaveNotes}
              />
            )}
            {viewMode === "week" && (
              <BookingWeekView
                currentDate={currentDate}
                editingNotes={editingNotes}
                setEditingNotes={setEditingNotes}
                notes={notes}
                setNotes={setNotes}
                getSessionsForDate={getSessionsForDate}
                groupSessionsByTimeSlot={groupSessionsByTimeSlot}
                handleCancelSession={handleCancelSession}
                isSessionInFuture={isSessionInFuture}
                handleSaveNotes={handleSaveNotes}
              />
            )}
            {viewMode === "month" && (
              <BookingMonthView 
                currentDate={currentDate} 
                setCurrentDate={setCurrentDate} 
                setViewMode={setViewMode} 
                getWaitlistForDate={getWaitlistForDate} 
              />
            )}
          </> 
        ) : (
          <>
            {viewMode === "day" && (
              <WaitingDayView
                getWaitlistForDate={getWaitlistForDate}
                groupWaitlistByTimeSlot={groupWaitlistByTimeSlot}
                currentDate={currentDate}
                handlePromoteFromWaitlist={handlePromoteFromWaitlist}
                handleRemoveFromWaitlist={handleRemoveFromWaitlist}
              />  
            )}
            {viewMode === "week" && (
              <WaitingWeekView
                currentDate={currentDate}
                getWaitlistForDate={getWaitlistForDate}
                groupWaitlistByTimeSlot={groupWaitlistByTimeSlot}
                handlePromoteFromWaitlist={handlePromoteFromWaitlist}
                handleRemoveFromWaitlist={handleRemoveFromWaitlist}
              />
            )}
            {viewMode === "month" && (
              <WaitingMonthView
                currentDate={currentDate}
                getWaitlistForDate={getWaitlistForDate}
                setCurrentDate={setCurrentDate}
                setViewMode={setViewMode}
              />
            )}
          </>
        )}
    </CardContent>
  );
};