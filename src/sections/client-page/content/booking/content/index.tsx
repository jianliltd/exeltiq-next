'use client';

import { CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Clock, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import useTranslate from "@/hook/use-translate";

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

interface DayOfWeek {
  dateStr: string;
  dayName: string;
  formatted: string;
  date: Date;
}

interface DayOfMonth {
  dateStr: string;
  dayNumber: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  date: Date;
}

interface BookingContentProps {
  viewMode: "day" | "week" | "month";
  currentDay: Date;
  currentDaySchedules: Schedule[];
  daysOfCurrentWeek: DayOfWeek[];
  currentWeekSchedules: Record<string, Schedule[]>;
  daysOfCurrentMonth: DayOfMonth[];
  currentMonthSchedules: Record<string, Schedule[]>;
  myBookings: Booking[];
  isCancelBooking: {
    loading: boolean;
    key: string | null;
  };
  isCancelingWaitlist: {
    loading: boolean;
    key: string | null;
  };
  isBooking: {
    loading: boolean;
    key: string | null;
  };
  isJoiningWaitlist: {
    loading: boolean;
    key: string | null;
  };
  handleCancelBooking: (id: string) => void;
  handleCancelWaitlist: (id: string) => void;
  handleBookSlot: (schedule: Schedule) => void;
  handleJoinWaitlist: (schedule: Schedule) => void;
  canGetRefund: (date: string, time: string) => boolean;
  getBookingCount: (date: string, time: string) => number;
  getWaitlistPosition: (date: string, time: string) => number | null;
  getWaitlistId: (date: string, time: string) => string | null;
  getWaitlistCount: (date: string, time: string) => number;
  formatDateKey: (date: Date) => string;
  DAYS: string[];
}

export const BookingContent = ({
  viewMode,
  currentDay,
  currentDaySchedules,
  daysOfCurrentWeek,
  currentWeekSchedules,
  daysOfCurrentMonth,
  currentMonthSchedules,
  myBookings,
  isCancelBooking,
  isCancelingWaitlist,
  isBooking,
  isJoiningWaitlist,
  handleCancelBooking,
  handleCancelWaitlist,
  handleBookSlot,
  handleJoinWaitlist,
  canGetRefund,
  getBookingCount,
  getWaitlistPosition,
  getWaitlistId,
  getWaitlistCount,
  formatDateKey,
  DAYS,
}: BookingContentProps) => {
  const { t } = useTranslate();

  return (
    <CardContent className="pt-0">
      {viewMode === "day" ? (
        // Day View
        <div className="space-y-4 min-h-60">
          {currentDaySchedules.length === 0 ? (
            <div className="text-center py-12">
              <Clock className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-lg font-medium text-muted-foreground">{t("gymBooking.noSlotsForDay")}</p>
            </div>
          ) : (
            <div className="grid gap-3">
              {currentDaySchedules.map((schedule) => {
                const booking = myBookings.find((b) => {
                  return b.schedule_date === schedule.schedule_date && b.start_time === schedule.start_time;
                });
                const isBooked = !!booking;

                // Check if the specific time slot is in the past
                const slotStartTime = new Date(currentDay);
                const [hours, minutes] = schedule.start_time.split(':');
                slotStartTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);
                const isPastSlot = slotStartTime <= new Date();

                const bookedCount = getBookingCount(formatDateKey(currentDay), schedule.start_time);
                const isFull = bookedCount >= schedule.max_capacity;
                
                const waitlistPosition = getWaitlistPosition(formatDateKey(currentDay), schedule.start_time);
                const waitlistId = getWaitlistId(formatDateKey(currentDay), schedule.start_time);
                const isOnWaitlist = waitlistPosition !== null;

                return (
                  <div
                    key={schedule.id}
                    className={cn(
                      "w-full flex items-center p-4 h-auto border rounded-md gap-2",
                      isBooked ? "bg-secondary" : "bg-background"
                    )}
                  >
                    <Clock className="h-4 w-4 shrink-0" />
                    <div className="text-left space-y-0.5 flex-1">
                      <div className="font-semibold">
                        {schedule.start_time} - {schedule.end_time}
                      </div>
                      <div className="flex items-center gap-2">
                        <Progress 
                          value={(bookedCount / schedule.max_capacity) * 100} 
                          className="h-2 w-28"
                        />
                        <span className="text-xs text-muted-foreground whitespace-nowrap">
                          {bookedCount}/{schedule.max_capacity}
                        </span>
                      </div>
                    </div>
                    {isBooked && (
                      <Badge variant="default" className="shrink-0 bg-green-600">
                        {t("gymBooking.booked")}
                      </Badge>
                    )}
                    {isOnWaitlist && !isBooked && (
                      <Badge className="shrink-0 bg-orange-100 hover:bg-orange-200 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400">
                        {t("gymBooking.position")}: {waitlistPosition}
                      </Badge>
                    )}
                    {/* Show action buttons based on status */}
                    {!isPastSlot && (
                      <div className="flex items-center gap-2 shrink-0">
                        {isBooked && booking && (
                          <Button 
                            variant="destructive" 
                            size="sm"
                            disabled={isCancelBooking.loading}
                            onClick={() => handleCancelBooking(booking.id)}
                            className="min-w-36"
                          >
                            {(isCancelBooking.key === booking.id && isCancelBooking.loading) ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : canGetRefund(formatDateKey(currentDay), schedule.start_time) 
                              ? t("gymBooking.cancelWithRefund")
                              : t("gymBooking.cancelWithoutRefund")}
                          </Button>
                        )}
                        {isOnWaitlist && !isBooked && waitlistId && (
                          <Button 
                            size="sm"
                            disabled={isCancelingWaitlist.loading}
                            onClick={() => handleCancelWaitlist(waitlistId)}
                            className="min-w-32 bg-orange-500 hover:bg-orange-600 text-white border-orange-500"
                          >
                            {(isCancelingWaitlist.key === waitlistId && isCancelingWaitlist.loading) ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : t("gymBooking.leaveWaitingList")}
                          </Button>
                        )}
                        {!isBooked && !isOnWaitlist && !isFull && (
                          <Button 
                            variant="default" 
                            size="sm"
                            disabled={isBooking.loading}
                            onClick={() => handleBookSlot(schedule)}
                            className="min-w-24"
                          >
                            {(isBooking.key === schedule.id && isBooking.loading) ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : t("gymBooking.joinClass")}
                          </Button>
                        )}
                        {!isBooked && !isOnWaitlist && isFull && (
                          <div className="flex items-center gap-2">
                            <Badge className="bg-cyan-100 hover:bg-cyan-200 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-400">
                              {t("gymBooking.waiting")}: {getWaitlistCount(formatDateKey(currentDay), schedule.start_time)}
                            </Badge>
                            <Button 
                              variant="secondary" 
                              size="sm"
                              disabled={isJoiningWaitlist.loading}
                              onClick={() => handleJoinWaitlist(schedule)}
                              className="min-w-32 bg-orange-500 hover:bg-orange-600 text-white"
                            >
                              {(isJoiningWaitlist.key === schedule.id && isJoiningWaitlist.loading) ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : t("gymBooking.joinWaitingList")}
                            </Button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ) : viewMode === "week" ? (
        // Week View
        <div className="grid gap-4 md:grid-cols-2">
          {daysOfCurrentWeek.map(({ dateStr, dayName, formatted, date }) => {
            const daySchedules = currentWeekSchedules[dateStr] || [];
            
            return (
              <div key={dateStr} className="border rounded-lg p-4">
                <h3 className="font-semibold mb-3">
                  {dayName} - {formatted}
                </h3>
                {daySchedules.length === 0 ? (
                  <p className="text-sm text-muted-foreground">{t("gymBooking.noSlotsAvailable")}</p>
                ) : (
                  <div className="space-y-2">
                    {daySchedules.map((schedule) => {
                      const booking = myBookings.find((b) => {
                        return b.schedule_date === schedule.schedule_date && b.start_time === schedule.start_time;
                      });
                      const isBooked = !!booking;

                      // Check if the specific time slot is in the past
                      const slotStartTime = new Date(date);
                      const [hours, minutes] = schedule.start_time.split(':');
                      slotStartTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);
                      const isPastSlot = slotStartTime <= new Date();

                      const bookedCount = getBookingCount(schedule.schedule_date, schedule.start_time);
                      const isFull = bookedCount >= schedule.max_capacity;
                      
                      const waitlistPosition = getWaitlistPosition(schedule.schedule_date, schedule.start_time);
                      const waitlistId = getWaitlistId(schedule.schedule_date, schedule.start_time);
                      const isOnWaitlist = waitlistPosition !== null;

                      return (
                        <div
                          key={schedule.id}
                          className={cn(
                            "w-full flex items-center h-auto py-2 border rounded-md px-2 gap-2",
                            isBooked ? "bg-secondary" : "bg-background"
                          )}
                        >
                          <Clock className="h-4 w-4 shrink-0" />
                          <div className="text-left flex-1">
                            <div className="font-medium text-sm">
                              {schedule.start_time} - {schedule.end_time}
                            </div>
                            <div className="flex items-center gap-2">
                              <Progress 
                                value={(bookedCount / schedule.max_capacity) * 100} 
                                className="h-1.5 w-28"
                              />
                              <span className="text-xs text-muted-foreground whitespace-nowrap">
                                {bookedCount}/{schedule.max_capacity}
                              </span>
                            </div>
                          </div>
                          {isBooked && (
                            <Badge variant="default" className="bg-green-600 shrink-0">
                              {t("gymBooking.booked")}
                            </Badge>
                          )}
                          {isOnWaitlist && !isBooked && (
                            <Badge className="bg-orange-100 hover:bg-orange-200 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400 text-xs shrink-0">
                              {t("gymBooking.position")}: {waitlistPosition}
                            </Badge>
                          )}
                          {/* Show action buttons based on status */}
                          {!isPastSlot && (
                            <div className="flex items-center gap-2 shrink-0">
                              {isBooked && booking && (
                                <Button 
                                  variant="destructive" 
                                  size="sm"
                                  disabled={isCancelBooking.loading}
                                  onClick={() => handleCancelBooking(booking.id)}
                                  className="min-w-36"
                                >
                                  {(isCancelBooking.key === booking.id && isCancelBooking.loading) ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                  ) : canGetRefund(schedule.schedule_date, schedule.start_time) 
                                    ? t("gymBooking.cancelWithRefund")
                                    : t("gymBooking.cancelWithoutRefund")}
                                </Button>
                              )}
                              {isOnWaitlist && !isBooked && waitlistId && (
                                <Button 
                                  size="sm"
                                  disabled={isCancelingWaitlist.loading}
                                  onClick={() => handleCancelWaitlist(waitlistId)}
                                  className="min-w-24 bg-orange-500 hover:bg-orange-600 text-white border-orange-500 text-xs"
                                >
                                  {(isCancelingWaitlist.key === waitlistId && isCancelingWaitlist.loading) ? (
                                    <Loader2 className="h-3 w-3 animate-spin" />
                                  ) : t("gymBooking.leaveList")}
                                </Button>
                              )}
                              {!isBooked && !isOnWaitlist && !isFull && (
                                <Button 
                                  variant="default" 
                                  size="sm"
                                  disabled={isBooking.loading}
                                  onClick={() => handleBookSlot(schedule)}
                                  className="min-w-24"
                                >
                                  {(isBooking.key === schedule.id && isBooking.loading) ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                  ) : t("gymBooking.joinClass")}
                                </Button>
                              )}
                              {!isBooked && !isOnWaitlist && isFull && (
                                <>
                                  <Badge className="bg-cyan-100 hover:bg-cyan-200 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-400 text-xs">
                                    {t("gymBooking.waiting")}: {getWaitlistCount(schedule.schedule_date, schedule.start_time)}
                                  </Badge>
                                  <Button 
                                    variant="secondary" 
                                    size="sm"
                                    disabled={isJoiningWaitlist.loading}
                                    onClick={() => handleJoinWaitlist(schedule)}
                                    className="min-w-24 bg-orange-500 hover:bg-orange-600 text-white text-xs"
                                  >
                                    {(isJoiningWaitlist.key === schedule.id && isJoiningWaitlist.loading) ? (
                                      <Loader2 className="h-3 w-3 animate-spin" />
                                    ) : t("gymBooking.joinWaitingList")}
                                  </Button>
                                </>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        // Month View
        <div className="space-y-2">
          {/* Day headers */}
          <div className="grid grid-cols-7 gap-2 mb-2">
            {DAYS.map((day) => (
              <div key={day} className="text-center text-sm font-semibold py-2">
                {day.substring(0, 3)}
              </div>
            ))}
          </div>
          
          {/* Calendar grid */}
          <div className="grid grid-cols-7 gap-2">
            {daysOfCurrentMonth.map(({ dateStr, dayNumber, isCurrentMonth, isToday, date }) => {
              const daySchedules = currentMonthSchedules[dateStr] || [];
              
              return (
                <div
                  key={dateStr}
                  className={cn(
                    "border rounded-lg p-2 min-h-[100px]",
                    !isCurrentMonth && "bg-muted/30 opacity-50",
                    isToday && "ring-2 ring-primary"
                  )}
                >
                  <div className={cn(
                    "text-sm font-semibold mb-2",
                    isToday && "text-primary"
                  )}>
                    {dayNumber}
                  </div>
                  
                  {daySchedules.length > 0 && (
                    <div className="flex flex-col">
                      {daySchedules.slice(0, 3).map((schedule) => {
                        const booking = myBookings.find((b) => {
                          return b.schedule_date === dateStr && b.start_time === schedule.start_time;
                        });
                        const isBooked = !!booking;

                        // Check if the specific time slot is in the past
                        const slotStartTime = new Date(date);
                        const [hours, minutes] = schedule.start_time.split(':');
                        slotStartTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);
                        const isPastSlot = slotStartTime <= new Date();

                        const bookedCount = getBookingCount(dateStr, schedule.start_time);
                        const isFull = bookedCount >= schedule.max_capacity;
                        
                        const waitlistPosition = getWaitlistPosition(dateStr, schedule.start_time);
                        const waitlistId = getWaitlistId(dateStr, schedule.start_time);
                        const isOnWaitlist = waitlistPosition !== null;

                        // Determine the action
                        let action: (() => void) | undefined;
                        const buttonText = schedule.start_time;
                        let variant: "secondary" | "ghost" | "destructive" | "default" = "ghost";
                        let isDisabled = isPastSlot;

                        if (isBooked && booking) {
                          action = () => handleCancelBooking(booking.id);
                          variant = "secondary";
                          isDisabled = isCancelBooking.loading && isCancelBooking.key === booking.id;
                        } else if (isOnWaitlist && waitlistId) {
                          action = () => handleCancelWaitlist(waitlistId);
                          variant = "secondary";
                          isDisabled = isCancelingWaitlist.loading && isCancelingWaitlist.key === waitlistId;
                        } else if (!isPastSlot && !isFull) {
                          action = () => handleBookSlot(schedule);
                          variant = "ghost";
                          isDisabled = isBooking.loading && isBooking.key === schedule.id;
                        } else if (!isPastSlot && isFull) {
                          action = () => handleJoinWaitlist(schedule);
                          variant = "ghost";
                          isDisabled = isJoiningWaitlist.loading && isJoiningWaitlist.key === schedule.id;
                        }

                        return (
                          <div key={schedule.id} className="mb-1">
                            <Button
                              variant={variant}
                              className="w-full justify-start text-xs p-1 h-auto"
                              disabled={isDisabled || !action}
                              onClick={action}
                              title={
                                isOnWaitlist 
                                  ? `${schedule.start_time} - ${schedule.end_time}: Waiting list position ${waitlistPosition}` 
                                  : isFull && !isBooked
                                  ? `${schedule.start_time} - ${schedule.end_time}: ${bookedCount}/${schedule.max_capacity} booked, ${getWaitlistCount(dateStr, schedule.start_time)} waiting`
                                  : `${schedule.start_time} - ${schedule.end_time}: ${bookedCount}/${schedule.max_capacity} booked`
                              }
                            >
                              <div className="flex flex-col gap-0.5">
                                <div className="flex items-center gap-1">
                                  <span className="text-xs font-medium text-left">
                                    {buttonText}
                                  </span>
                                  {isBooked && (
                                    <Badge variant="default" className="p-0.5 bg-green-600 size-4 flex items-center justify-center">
                                      ✓
                                    </Badge>
                                  )}
                                  {isOnWaitlist && !isBooked && (
                                    <Badge className="p-0.5 bg-orange-500 hover:bg-orange-600 size-4 flex items-center justify-center text-white text-[8px]">
                                      {waitlistPosition}
                                    </Badge>
                                  )}
                                  {!isBooked && !isOnWaitlist && isFull && (
                                    <Badge className="p-0.5 bg-cyan-500 hover:bg-cyan-600 size-4 flex items-center justify-center text-white text-[8px]">
                                      {getWaitlistCount(dateStr, schedule.start_time)}
                                    </Badge>
                                  )}
                                </div>
                                <div className="flex items-center gap-1 px-1">
                                  <Progress 
                                    value={(bookedCount / schedule.max_capacity) * 100} 
                                    className="h-1 w-8"
                                  />
                                  <span className="text-[9px] text-muted-foreground">
                                    {bookedCount}/{schedule.max_capacity}
                                  </span>
                                </div>
                              </div>

                            </Button>
                          </div>
                        );
                      })}
                      {daySchedules.length > 3 && (
                        <div className="text-xs text-muted-foreground pl-1">
                          +{daySchedules.length - 3} {t("gymBooking.more")}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </CardContent>
  );
};
