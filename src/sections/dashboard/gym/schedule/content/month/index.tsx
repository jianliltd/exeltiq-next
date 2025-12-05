import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { CalendarClock, Trash2 } from "lucide-react";

import { eachDayOfInterval, endOfMonth, endOfWeek, format, isSameDay, startOfMonth, startOfWeek } from "date-fns";

import useTranslate from "@/hook/use-translate";

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

type MonthScheduleProps = {
  currentDate: Date;
  schedules: ScheduleSlot[];
  onToggleActive: (scheduleId: string, isActive: boolean) => void;
  onEditSchedule: (schedule: ScheduleSlot) => void;
  onDeleteSchedule: (scheduleId: string) => void;
}

export const MonthSchedule = ({ 
  currentDate,
  schedules,
  onToggleActive,
  onEditSchedule,
  onDeleteSchedule
}: MonthScheduleProps) => {
  const { t } = useTranslate();

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });
  const monthDays = eachDayOfInterval({ start: startDate, end: endDate });

  return (
    <div className="grid grid-cols-7 gap-2">
      {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
        <div key={day} className="text-center font-semibold text-sm p-2">
          {day}
        </div>
      ))}
      {monthDays.map((day) => {
        const isToday = isSameDay(day, new Date());
        const isCurrentMonth = day.getMonth() === currentDate.getMonth();
        const dayOfWeek = day.getDay() === 0 ? 7 : day.getDay();
        
        // Get schedules for this day
        const daySchedules = schedules
          .filter(schedule => schedule.day_of_week === dayOfWeek)
          .sort((a, b) => a.start_time.localeCompare(b.start_time))
          .slice(0, 2); // Show only first 2 slots
        
        const totalSchedules = schedules.filter(schedule => schedule.day_of_week === dayOfWeek).length;
        
        return (
          <div 
            key={day.toISOString()} 
            className={`min-h-[140px] border rounded-lg p-2 ${isToday ? "border-primary bg-primary/5" : ""} ${!isCurrentMonth ? "opacity-50" : ""}`}
          >
            <div className={`text-sm mb-2 ${isToday ? "text-primary font-bold" : "font-medium"}`}>
              {format(day, "d")}
            </div>
            
            <div className="space-y-2">
              {daySchedules.map((schedule) => (
                <div 
                  key={schedule.id} 
                  className="bg-primary/5 border border-primary/20 rounded p-1.5 space-y-1.5"
                >
                  {/* Time */}
                  <div className="text-xs font-medium truncate">
                    {schedule.start_time}:00
                  </div>
                  
                  {/* Capacity Badge */}
                  <Badge 
                    variant="default" 
                    className="bg-primary text-white text-[10px] px-1.5 py-0 h-4"
                  >
                    {t('gym.cap')}: {schedule.max_capacity}
                  </Badge>
                  
                  {/* Actions */}
                  <div className="flex items-center justify-between gap-1">
                    <Switch 
                      checked={schedule.is_active}
                      onCheckedChange={(checked) => onToggleActive(schedule.id, checked)}
                      className="scale-75"
                    />
                    
                    <div className="flex gap-0.5">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-5 w-5 text-primary hover:text-primary hover:bg-primary/10"
                        onClick={() => onEditSchedule(schedule)}
                      >
                        <CalendarClock className="h-3 w-3" />
                      </Button>
                      
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-5 w-5 text-destructive hover:text-destructive hover:bg-destructive/10"
                        onClick={() => onDeleteSchedule(schedule.id)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
              
              {totalSchedules > 2 && (
                <div className="text-[10px] text-muted-foreground text-center">
                  +{totalSchedules - 2} more
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

