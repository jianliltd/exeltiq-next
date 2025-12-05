'use client';

import useTranslate from "@/hook/use-translate";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

import { Calendar, CalendarClock, Trash2 } from "lucide-react";

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

type DayScheduleProps = {
  currentDate: Date;
  schedules: ScheduleSlot[];
  onToggleActive: (scheduleId: string, isActive: boolean) => void;
  onEditSchedule: (schedule: ScheduleSlot) => void;
  onDeleteSchedule: (scheduleId: string) => void;
}

export const DaySchedule = ({ 
  currentDate, 
  schedules,
  onToggleActive,
  onEditSchedule,
  onDeleteSchedule
}: DayScheduleProps) => {
  const { t } = useTranslate();

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

  // Filter schedules for current day
  const dayOfWeek = currentDate.getDay() === 0 ? 7 : currentDate.getDay(); // Convert Sunday (0) to 7
  const daySchedules = schedules.filter(schedule => schedule.day_of_week === dayOfWeek);

  // Sort by start time
  const sortedSchedules = [...daySchedules].sort((a, b) => 
    a.start_time.localeCompare(b.start_time)
  );

  if (sortedSchedules.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
        <p className="text-lg font-medium">{t('gym.noSlotsScheduled')}</p>
        <p className="text-sm text-muted-foreground">{t('gym.addSlotsToSchedule')}</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {sortedSchedules.map((schedule) => {
        const duration = calculateDuration(schedule.start_time, schedule.end_time);
        
        return (
          <div 
            key={schedule.id} 
            className="flex items-center justify-between p-4 bg-background border rounded-lg hover:border-primary/50 transition-colors"
          >
            {/* Left side - Time and Info */}
            <div className="flex items-center gap-4">
              <div>
                <div className="font-semibold text-base">
                  {schedule.start_time}:00 - {schedule.end_time}:00
                </div>
                <div className="text-sm text-muted-foreground">
                  {t('gym.duration')}: {duration}
                </div>
              </div>
              
              <Badge 
                variant="default" 
                className="bg-primary text-white hover:bg-primary/90"
              >
                {t('gym.capacity')}: {schedule.max_capacity}
              </Badge>
            </div>

            {/* Right side - Actions */}
            <div className="flex items-center gap-3">
              <Switch 
                checked={schedule.is_active}
                onCheckedChange={(checked) => onToggleActive(schedule.id, checked)}
              />
              
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 text-primary hover:text-primary hover:bg-primary/10"
                onClick={() => onEditSchedule(schedule)}
              >
                <CalendarClock className="h-5 w-5" />
              </Button>
              
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 text-destructive hover:text-destructive hover:bg-destructive/10"
                onClick={() => onDeleteSchedule(schedule.id)}
              >
                <Trash2 className="h-5 w-5" />
              </Button>
            </div>
          </div>
        );
      })}
    </div>
  );
};