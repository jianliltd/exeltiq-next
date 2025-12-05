"use client";

import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronLeft, ChevronRight, Calendar, CalendarDays, CalendarRange, Loader2 } from "lucide-react";
import useTranslate from "@/hook/use-translate";
import { ViewMode } from "../../type";
import { useState, useEffect } from "react";
import { DaySchedule } from "./day";
import { WeekSchedule } from "./week";
import { MonthSchedule } from "./month";
import { mockScheduleSlots } from "../mock-schedules";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";


interface ScheduleSlot {
  id: string;
  day_of_week: number;
  start_time: string;
  end_time: string;
  max_capacity: number;
  is_active: boolean;
  schedule_date: string | null;
  repeat_id: string | null;
  repeat_type: string | null;
}

interface ScheduleContentProps {
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  currentDateDisplay: string;
  currentDate: Date;
  onPreviousClick: () => void;
  onNextClick: () => void;
}

export const ScheduleContent = ({
  viewMode,
  setViewMode,
  currentDateDisplay,
  currentDate,
  onPreviousClick,
  onNextClick,
}: ScheduleContentProps) => {
  const { t } = useTranslate();

  const [mounted, setMounted] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showDeleteAllConfirm, setShowDeleteAllConfirm] = useState(false);
  const [isDeletingSlots, setIsDeletingSlots] = useState(false);
  const [showExtendDialog, setShowExtendDialog] = useState(false);
  const [selectedScheduleForExtend, setSelectedScheduleForExtend] = useState<ScheduleSlot | null>(null);
  const [extendEndDate, setExtendEndDate] = useState("");
  const [isExtending, setIsExtending] = useState(false);
  const [lastScheduledDate, setLastScheduledDate] = useState<string | null>(null);
  const [showDeleteEventDialog, setShowDeleteEventDialog] = useState(false);
  const [selectedScheduleForDelete, setSelectedScheduleForDelete] = useState<ScheduleSlot | null>(null);
  const [deleteOption, setDeleteOption] = useState<"this" | "all" | "range">("this");
  const [deleteRangeStart, setDeleteRangeStart] = useState("");
  const [deleteRangeEnd, setDeleteRangeEnd] = useState("");
  // Using mock schedule slots for testing
  const [schedules, setSchedules] = useState<ScheduleSlot[]>(mockScheduleSlots);

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleDeleteAllSchedulesForViewMode = async () => {
      setIsDeletingSlots(true);
      // TODO: Implement delete logic
      setIsDeletingSlots(false);
  };

  const handleExtendSchedule = async () => {
    if (!selectedScheduleForExtend || !extendEndDate) return;
    
    setIsExtending(true);
    try {
      // TODO: Implement extend schedule logic with API
      console.log('Extending schedule:', selectedScheduleForExtend.id, 'to:', extendEndDate);
      
      // Close dialog and reset
      setShowExtendDialog(false);
      setSelectedScheduleForExtend(null);
      setExtendEndDate("");
      setLastScheduledDate(null);
    } catch (error) {
      console.error('Error extending schedule:', error);
    } finally {
      setIsExtending(false);
    }
  };

  const openExtendDialog = (schedule: ScheduleSlot) => {
    setSelectedScheduleForExtend(schedule);
    
    // Calculate the last scheduled date for this recurring schedule
    if (schedule.repeat_id && schedule.schedule_date) {
      // Find all schedules with the same repeat_id and get the latest date
      const relatedSchedules = schedules.filter(s => s.repeat_id === schedule.repeat_id);
      if (relatedSchedules.length > 0) {
        const latestDate = relatedSchedules
          .map(s => s.schedule_date)
          .filter((date): date is string => date !== null)
          .sort()
          .pop();
        setLastScheduledDate(latestDate || null);
      } else {
        setLastScheduledDate(schedule.schedule_date);
      }
    } else {
      setLastScheduledDate(schedule.schedule_date);
    }
    
    setShowExtendDialog(true);
  };

  const handleToggleActive = async (scheduleId: string, isActive: boolean) => {
    console.log('Toggle schedule:', scheduleId, isActive);
    // TODO: implement toggle active logic with API
    setSchedules(prev => prev.map(s => 
      s.id === scheduleId ? { ...s, is_active: isActive } : s
    ));
  };

  const handleEditSchedule = (schedule: ScheduleSlot) => {
    // Open the extend dialog with the selected schedule
    openExtendDialog(schedule);
  };

  const handleDeleteSchedule = async (scheduleId: string) => {
    console.log('Delete schedule:', scheduleId);
    // Find the schedule and open the delete dialog
    const schedule = schedules.find(s => s.id === scheduleId);
    if (schedule) {
      setSelectedScheduleForDelete(schedule);
      setShowDeleteEventDialog(true);
    }
  };

  const handleDeleteEvent = async () => {
    if (!selectedScheduleForDelete) return;

    setIsDeletingSlots(true);
    try {
      switch (deleteOption) {
        case "this":
          // Delete only this single occurrence
          console.log('Deleting single event:', selectedScheduleForDelete.id);
          setSchedules(prev => prev.filter(s => s.id !== selectedScheduleForDelete.id));
          break;

        case "all":
          // Delete all events with the same repeat_id
          if (selectedScheduleForDelete.repeat_id) {
            console.log('Deleting all recurring events with repeat_id:', selectedScheduleForDelete.repeat_id);
            setSchedules(prev => prev.filter(s => s.repeat_id !== selectedScheduleForDelete.repeat_id));
          } else {
            // If no repeat_id, just delete this one
            setSchedules(prev => prev.filter(s => s.id !== selectedScheduleForDelete.id));
          }
          break;

        case "range":
          // Delete events in date range with the same repeat_id
          if (selectedScheduleForDelete.repeat_id && deleteRangeStart && deleteRangeEnd) {
            console.log('Deleting events in range:', deleteRangeStart, 'to', deleteRangeEnd);
            setSchedules(prev => prev.filter(s => {
              if (s.repeat_id !== selectedScheduleForDelete.repeat_id) return true;
              if (!s.schedule_date) return true;
              return s.schedule_date < deleteRangeStart || s.schedule_date > deleteRangeEnd;
            }));
          }
          break;
      }

      // Close dialog and reset
      setShowDeleteEventDialog(false);
      setSelectedScheduleForDelete(null);
      setDeleteOption("this");
      setDeleteRangeStart("");
      setDeleteRangeEnd("");
    } catch (error) {
      console.error('Error deleting event:', error);
    } finally {
      setIsDeletingSlots(false);
    }
  };

  const getSlotsCountForViewMode = () => {
    const currentDateStr = currentDate.toISOString().split('T')[0];
    
    switch (viewMode) {
      case "day":
        // Count slots for the current day
        return schedules.filter(s => {
          const slotDate = s.schedule_date || currentDateStr;
          return slotDate === currentDateStr;
        }).length;
      case "week":
        // Count slots for the current week
        const weekStart = new Date(currentDate);
        weekStart.setDate(currentDate.getDate() - currentDate.getDay() + 1); // Monday
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekStart.getDate() + 6); // Sunday
        
        return schedules.filter(s => {
          const slotDate = new Date(s.schedule_date || currentDateStr);
          return slotDate >= weekStart && slotDate <= weekEnd;
        }).length;
      case "month":
        // Count slots for the current month
        const monthStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        const monthEnd = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
        
        return schedules.filter(s => {
          const slotDate = new Date(s.schedule_date || currentDateStr);
          return slotDate >= monthStart && slotDate <= monthEnd;
        }).length;
      default:
        return 0;
    }
  };

  // Helper functions to format dates
  const formatDay = (date: Date) => {
    return date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  };

  const formatWeekRange = (monday: Date) => {
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    return `${monday.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${sunday.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
  };

  const formatMonthYear = (date: Date) => {
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
  };

  const getWeekMonday = (date: Date) => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
    return new Date(d.setDate(diff));
  };

  return (
    <>
    <Card>
      <CardHeader>
        <div className="flex md:flex-row flex-col gap-4 justify-between">
          {/* Left: Navigation */}
          <div className="flex items-center justify-between gap-2 sm:gap-4">
            <Button
              variant="outline"
              size="icon"
              className="flex-none h-8 w-8 sm:h-10 sm:w-10"
              onClick={onPreviousClick}
            >
              <ChevronLeft className="h-3 w-3 sm:h-4 sm:w-4" />
            </Button>
            
            <div className="flex flex-col items-center gap-1 flex-1 min-w-0">
              <CardTitle className="text-center text-sm sm:text-base md:text-lg truncate px-1">
                {currentDateDisplay}
              </CardTitle>
            </div>
            
            <Button
              variant="outline"
              size="icon"
              className="flex-none h-8 w-8 sm:h-10 sm:w-10"
              onClick={onNextClick}
            >
              <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4" />
            </Button>
          </div>

          {/* Right: View Mode Tabs */}
          <div className="flex items-center justify-center lg:justify-end">
            <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as ViewMode)}>
              <TabsList className="grid grid-cols-3">
                <TabsTrigger value="day" className="flex items-center justify-center gap-1.5 text-xs sm:text-sm px-3">
                  <CalendarDays className="h-4 w-4" />
                  <span>{t('gym.day')}</span>
                </TabsTrigger>
                <TabsTrigger value="week" className="flex items-center justify-center gap-1.5 text-xs sm:text-sm px-3">
                  <CalendarRange className="h-4 w-4" />
                  <span>{t('gym.week')}</span>
                </TabsTrigger>
                <TabsTrigger value="month" className="flex items-center justify-center gap-1.5 text-xs sm:text-sm px-3">
                  <Calendar className="h-4 w-4" />
                  <span>{t('gym.month')}</span>
                </TabsTrigger>
              </TabsList>
            </Tabs>
            <div className="flex gap-2">
                <Button 
                  variant="destructive" 
                  className="flex-1 sm:flex-none text-xs sm:text-sm"
                  onClick={() => setShowDeleteConfirm(true)}
                >
                  {viewMode === "day"
                    ? t('gym.deleteDay')
                    : viewMode === "week"
                    ? t('gym.deleteWeek')
                    : t('gym.deleteMonth')}
                </Button>
                <Button 
                  variant="destructive"
                  className="flex-1 sm:flex-none text-xs sm:text-sm"
                  onClick={() => setShowDeleteAllConfirm(true)}
                  disabled={schedules.length === 0}
                >
                  {t('gym.deleteAll')}
                </Button>
              </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {viewMode === "day" && (
          <DaySchedule 
            currentDate={currentDate}
            schedules={schedules}
            onToggleActive={handleToggleActive}
            onEditSchedule={handleEditSchedule}
            onDeleteSchedule={handleDeleteSchedule}
          />
        )}
        {viewMode === "week" && (
          <WeekSchedule 
            currentDate={currentDate}
            schedules={schedules}
            onToggleActive={handleToggleActive}
            onEditSchedule={handleEditSchedule}
            onDeleteSchedule={handleDeleteSchedule}
          />
        )}
        {viewMode === "month" && (
          <MonthSchedule 
            currentDate={currentDate}
            schedules={schedules}
            onToggleActive={handleToggleActive}
            onEditSchedule={handleEditSchedule}
            onDeleteSchedule={handleDeleteSchedule}
          />
        )}
      </CardContent>
    </Card>
    
    {/* Dialogs - Only render after mount to prevent hydration errors */}
    {mounted && (
      <>
        {/* Delete Day/Week/Month Confirmation Dialog */}
        <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t('common.confirm')}</AlertDialogTitle>
          <AlertDialogDescription>
          {t('gym.deleteConfirmCount', { 
                count: getSlotsCountForViewMode(), 
                viewMode: t(`gym.${viewMode}`) 
              })}
              {viewMode === "day" && ` (${formatDay(currentDate)})`}
              {viewMode === "week" && ` (${formatWeekRange(getWeekMonday(currentDate))})`}
              {viewMode === "month" && ` (${formatMonthYear(currentDate)})`}
              <br /><br />
              {t('gym.cannotBeUndone')}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeletingSlots}>
            {t('common.cancel')}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={(e: React.MouseEvent<HTMLButtonElement> | React.KeyboardEvent<HTMLButtonElement>) => {
              e.preventDefault();
              handleDeleteAllSchedulesForViewMode();
            }}
            disabled={isDeletingSlots}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isDeletingSlots ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                {t('gym.deleting')}
              </>
            ) : (
              t('common.delete')
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
    <AlertDialog open={showDeleteAllConfirm} onOpenChange={setShowDeleteAllConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('gym.deleteAllTitle')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('gym.deleteAllMessage')}
              <br /><br />
              <strong className="text-destructive">{t('gym.cannotBeUndone')}</strong>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeletingSlots}>{t('common.cancel')}</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                handleDeleteAllSchedulesForViewMode();
              }}
              disabled={isDeletingSlots}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeletingSlots ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  {t('gym.deleting')}
                </>
              ) : (
                t('gym.deleteAll')
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
    </AlertDialog>
    <AlertDialog open={showExtendDialog} onOpenChange={setShowExtendDialog}>
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle>{t('gym.extendRecurringScheduleTitle')}</AlertDialogTitle>
            <AlertDialogDescription>
              {selectedScheduleForExtend && (
                <div className="space-y-2 mb-4">
                  <span className="font-medium">{t('gym.time')}:</span> {selectedScheduleForExtend.start_time} - {selectedScheduleForExtend.end_time}
                  <div className="text-sm">
                    <span className="font-medium">{t('gym.repeatType')}:</span> <span className="text-primary font-semibold">{selectedScheduleForExtend.repeat_type || 'N/A'}</span>
                  </div>
                  <div className="text-sm">
                    <span className="font-medium">{t('gym.capacity')}:</span> <span className="text-primary font-semibold">{selectedScheduleForExtend.max_capacity}</span>
                  </div>
                  {lastScheduledDate && (
                    <div className="text-sm">
                      <span className="font-medium">{t('gym.lastScheduledDate')}:</span> <span className="text-primary font-semibold">{lastScheduledDate}</span>
                    </div>
                  )}
                </div>
              )}
              {t('gym.extendScheduleDescription')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="extend-end-date">{t('gym.newEndDate')}</Label>
               <Input
                 id="extend-end-date"
                 type="date"
                 value={extendEndDate}
                 onChange={(e: React.ChangeEvent<HTMLInputElement>) => setExtendEndDate(e.target.value)}
               />
            </div>
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel disabled={isExtending}>{t('common.cancel')}</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                handleExtendSchedule();
              }}
              disabled={isExtending}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {isExtending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  {t('gym.extending')}
                </>
              ) : (
                t('gym.extendSchedule')
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
    </AlertDialog>
          {/* Enhanced Delete Event Dialog */}
    <AlertDialog open={showDeleteEventDialog} onOpenChange={setShowDeleteEventDialog}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle>{t('gym.deleteEvent')}</AlertDialogTitle>
          <AlertDialogDescription>
            {selectedScheduleForDelete && (
              <div className="flex flex-row gap-2 mb-4">
                <div className="text-sm text-muted-foreground">
                  {selectedScheduleForDelete.schedule_date}
                </div>
                <div className="text-sm font-medium text-foreground mb-2">
                  {selectedScheduleForDelete.start_time} - {selectedScheduleForDelete.end_time}
                </div>
              </div>
            )}
            {t('gym.chooseDeleteOption')}
          </AlertDialogDescription>
        </AlertDialogHeader>
        
        <div className="space-y-4">
           <RadioGroup value={deleteOption} onValueChange={(value: "this" | "all" | "range") => setDeleteOption(value)}>
            <div className="flex items-start space-x-2">
              <RadioGroupItem value="this" id="delete-this" />
              <Label htmlFor="delete-this" className="flex-1 cursor-pointer">
                <div className="font-medium">{t('gym.thisEventOnly')}</div>
                <div className="text-sm text-muted-foreground">
                  {t('gym.deleteOnlyThisOccurrence')}
                </div>
              </Label>
            </div>

            {selectedScheduleForDelete?.repeat_id && (
              <>
                <div className="flex items-start space-x-2">
                  <RadioGroupItem value="all" id="delete-all" />
                  <Label htmlFor="delete-all" className="flex-1 cursor-pointer">
                    <div className="font-medium">{t('gym.allRepeatedEvents')}</div>
                    <div className="text-sm text-muted-foreground">
                      {t('gym.deleteAllInSeries')}
                      {selectedScheduleForDelete?.repeat_type && selectedScheduleForDelete.repeat_type !== "none" && (
                        <span className="ml-1">({selectedScheduleForDelete.repeat_type})</span>
                      )}
                    </div>
                  </Label>
                </div>

                <div className="flex items-start space-x-2">
                  <RadioGroupItem value="range" id="delete-range" />
                  <Label htmlFor="delete-range" className="flex-1 cursor-pointer">
                    <div className="font-medium">{t('gym.eventsInDateRange')}</div>
                    <div className="text-sm text-muted-foreground">
                      {t('gym.deleteEventsInRange')}
                    </div>
                  </Label>
                </div>

                {deleteOption === "range" && (
                  <div className="ml-6 space-y-3 pt-2">
                    <div className="space-y-2">
                      <Label htmlFor="range-start" className="text-sm">{t('gym.startDate')}</Label>
                      <Input
                        id="range-start"
                        type="date"
                        value={deleteRangeStart}
                        onChange={(e) => setDeleteRangeStart(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="range-end" className="text-sm">{t('gym.endDate')}</Label>
                      <Input
                        id="range-end"
                        type="date"
                        value={deleteRangeEnd}
                        onChange={(e) => setDeleteRangeEnd(e.target.value)}
                      />
                    </div>
                  </div>
                )}
              </>
            )}
          </RadioGroup>
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeletingSlots}>{t('common.cancel')}</AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              handleDeleteEvent();
            }}
            disabled={isDeletingSlots}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isDeletingSlots ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                {t('gym.deleting')}
              </>
            ) : (
              t('common.delete')
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
      </>
    )}
  </>
  );
};
