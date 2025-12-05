import { Badge } from "@/components/ui/badge";
import { Clock } from "lucide-react";

import { eachDayOfInterval, endOfMonth, endOfWeek, format, isSameDay, startOfMonth, startOfWeek } from "date-fns";

import useTranslate from "@/hook/use-translate";

import { ViewMode, WaitlistEntry } from "../../../type";

type BookingMonthViewProps = {
  currentDate: Date;
  setCurrentDate: (date: Date) => void;
  setViewMode: (viewMode: ViewMode) => void;
  getWaitlistForDate: (date: Date) => WaitlistEntry[];
}

export const BookingMonthView = ({ currentDate, setCurrentDate, setViewMode, getWaitlistForDate }: BookingMonthViewProps) => {

  const { t } = useTranslate();

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });
  const monthDays = eachDayOfInterval({ start: startDate, end: endDate });

  return (
    <div className="grid grid-cols-7 gap-2">
      {[t('gym.monday'), t('gym.tuesday'), t('gym.wednesday'), t('gym.thursday'), t('gym.friday'), t('gym.saturday'), t('gym.sunday')].map((day) => (
        <div key={day} className="text-center font-semibold text-sm p-2">
          {day}
        </div>
      ))}
      {monthDays.map((day) => {
        const dayWaitlist = getWaitlistForDate(day);
        const isToday = isSameDay(day, new Date());
        const isCurrentMonth = day.getMonth() === currentDate.getMonth();
        
        return (
          <div 
            key={day.toISOString()} 
            className={`min-h-[100px] border rounded-lg p-2 ${isToday ? "border-primary bg-primary/5" : ""} ${!isCurrentMonth ? "opacity-50" : ""}`}
          >
            <div className={`text-sm mb-2 ${isToday ? "text-primary font-bold" : "font-medium"}`}>
              {format(day, "d")}
            </div>
            <div className="space-y-1">
              {dayWaitlist.length > 0 && (
                <Badge variant="outline" className="border-amber-400 text-amber-600 text-xs">
                  {dayWaitlist.length} {t('gym.waiting')}
                </Badge>
              )}
              {dayWaitlist.slice(0, 2).map((entry: WaitlistEntry) => (
                <div 
                  key={entry.id} 
                  className="mt-1 p-1 bg-amber-50 border border-amber-200 rounded text-xs cursor-pointer hover:bg-amber-100"
                  onClick={() => {
                    setCurrentDate(day);
                    setViewMode("day");
                  }}
                >
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    <span className="truncate">{entry.schedule?.start_time.slice(0, 5)}</span>
                  </div>
                  {entry.client && (
                    <div className="truncate font-medium">{entry.client.name}</div>
                  )}
                </div>
              ))}
              {dayWaitlist.length > 2 && (
                <div className="text-xs text-muted-foreground mt-1">
                  +{dayWaitlist.length - 2} {t('gym.more')}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};