import { format, isSameDay, startOfWeek, eachDayOfInterval, endOfWeek } from "date-fns";

import useTranslate from "@/hook/use-translate";
import { CalendarClock, Clock, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

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

type WeekScheduleProps = {
  currentDate: Date;
  schedules: ScheduleSlot[];
  onToggleActive: (scheduleId: string, isActive: boolean) => void;
  onEditSchedule: (schedule: ScheduleSlot) => void;
  onDeleteSchedule: (scheduleId: string) => void;
}

export const WeekSchedule = ({ 
  currentDate,
  schedules,
  onToggleActive,
  onEditSchedule,
  onDeleteSchedule
}: WeekScheduleProps) => {
  const { t } = useTranslate();

  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
  const weekDays = eachDayOfInterval({
    start: weekStart,
    end: endOfWeek(currentDate, { weekStartsOn: 1 }),
  });

  // Calculate duration in hours
  const calculateDuration = (startTime: string, endTime: string): string => {
    const [startHour, startMin] = startTime.split(':').map(Number);
    const [endHour, endMin] = endTime.split(':').map(Number);
    const durationMinutes = (endHour * 60 + endMin) - (startHour * 60 + startMin);
    const hours = Math.floor(durationMinutes / 60);
    const minutes = durationMinutes % 60;
    
    if (hours === 0) return `${minutes}m`;
    if (minutes === 0) return `${hours}h`;
    return `${hours}h ${minutes}m`;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {weekDays.map((day) => {
        const isToday = isSameDay(day, new Date());
        const dayOfWeek = day.getDay() === 0 ? 7 : day.getDay();
        
        // Filter schedules for this day and sort by start time
        const daySchedules = schedules
          .filter(schedule => schedule.day_of_week === dayOfWeek)
          .sort((a, b) => a.start_time.localeCompare(b.start_time));
        
        return (
          <div 
            key={day.toISOString()} 
            className={`border rounded-lg p-4 ${isToday ? "border-primary bg-primary/5" : ""}`}
          >
            <div className="flex items-center gap-2 mb-4">
              <Clock className="h-4 w-4" />
              <h3 className="text-base font-semibold">
                {format(day, "EEEE")} <span className="text-muted-foreground font-normal">{format(day, "M/d")}</span>
              </h3>
            </div>
            
            <div className="space-y-3">
              {daySchedules.length === 0 ? (
                <p className="text-sm text-muted-foreground italic">{t('gym.noSlots')}</p>
              ) : (
                daySchedules.map((schedule) => {
                  const duration = calculateDuration(schedule.start_time, schedule.end_time);
                  
                  return (
                    <div 
                      key={schedule.id} 
                      className="flex flex-col gap-2 p-3 bg-background border rounded-lg hover:border-primary/50 transition-colors"
                    >
                      {/* Time and Info */}
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-sm">
                            {schedule.start_time}:00 - {schedule.end_time}:00
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {t('gym.duration')}: {duration}
                          </div>
                        </div>
                        
                        <Badge 
                          variant="default" 
                          className="bg-primary text-white hover:bg-primary/90 text-xs whitespace-nowrap"
                        >
                          {t('gym.capacity')}: {schedule.max_capacity}
                        </Badge>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center justify-end gap-2">
                        <Switch 
                          checked={schedule.is_active}
                          onCheckedChange={(checked) => onToggleActive(schedule.id, checked)}
                        />
                        
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-primary hover:text-primary hover:bg-primary/10"
                          onClick={() => onEditSchedule(schedule)}
                        >
                          <CalendarClock className="h-4 w-4" />
                        </Button>
                        
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                          onClick={() => onDeleteSchedule(schedule.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

