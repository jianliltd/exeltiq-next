import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import { eachDayOfInterval, endOfWeek, format, isPast, isSameDay, parseISO, startOfWeek } from "date-fns";

import { Clock, Ticket, User, UserPlus } from "lucide-react";

import { WaitlistEntry } from "../../../type";
import useTranslate from "@/hook/use-translate";
import { useRouter } from "next/navigation";

type WaitingWeekViewProps = {
  currentDate: Date;
  getWaitlistForDate: (date: Date) => WaitlistEntry[];
  groupWaitlistByTimeSlot: (dayWaitlist: WaitlistEntry[]) => { [key: string]: WaitlistEntry[] };
  handlePromoteFromWaitlist: (entry: WaitlistEntry) => void;
  handleRemoveFromWaitlist: (entryId: string) => void;
}
export const WaitingWeekView = ({ currentDate, getWaitlistForDate, groupWaitlistByTimeSlot, handlePromoteFromWaitlist, handleRemoveFromWaitlist }: WaitingWeekViewProps) => {
  const { t } = useTranslate();
  const router = useRouter();
  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
  const weekDays = eachDayOfInterval({
    start: weekStart,
    end: endOfWeek(currentDate, { weekStartsOn: 1 }),
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {weekDays.map((day) => {
        const dayWaitlist = getWaitlistForDate(day);
        const groupedWaitlist = groupWaitlistByTimeSlot(dayWaitlist);
        const isToday = isSameDay(day, new Date());
        
        return (
          <div key={day.toISOString()} className={`border rounded-lg p-4 ${isToday ? "border-primary bg-primary/5" : ""}`}>
            <div className="flex items-center gap-2 mb-3">
              <Clock className="h-4 w-4" />
              <h3 className="text-base font-semibold">
                {format(day, "EEEE")} <span className="text-muted-foreground font-normal">{format(day, "M/d")}</span>
              </h3>
            </div>
            <div className="space-y-3">
              {dayWaitlist.length === 0 ? (
                <p className="text-sm text-muted-foreground italic">{t('gym.noWaitlist')}</p>
              ) : (
                Object.entries(groupedWaitlist).map(([timeKey, timeEntries]) => {
                  const [startTime, endTime] = timeKey.split('-');
                  return (
                    <div key={timeKey} className="space-y-2">
                      <div className="flex items-center justify-between p-2 bg-background border rounded-lg">
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-medium">{startTime} - {endTime}</span>
                          <Badge variant="outline" className="border-amber-400 text-amber-600 text-xs">
                            {t('gym.waitlist')}: {timeEntries.length}
                          </Badge>
                        </div>
                      </div>
                      {timeEntries.map((entry) => {
                        // Combine date and start time to check if schedule is in the past
                        const scheduleDateTimeStr = `${entry.schedule_date}T${entry.schedule?.start_time || '00:00:00'}`;
                        const scheduleDateTime = parseISO(scheduleDateTimeStr);
                        const isPastSchedule = isPast(scheduleDateTime);
                        
                        return (
                          <div key={entry.id} className="ml-4 p-2 bg-amber-50 border border-amber-200 rounded-lg">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                {entry.client && (
                                  <div className="flex items-center gap-2 mb-1">
                                    <User className="h-3 w-3" />
                                    <span
                                      className="text-sm font-medium cursor-pointer hover:underline hover:text-primary"
                                      onClick={() => router.push(`/clients/${entry.client?.id}`)}
                                    >
                                      {entry.client?.name}
                                    </span>
                                    <Badge variant="outline" className="bg-orange-100 hover:bg-orange-200 text-orange-800 border-orange-200">
                                      {t('gym.position')}: {entry.position}
                                    </Badge>
                                    <Badge variant={entry.client.sessions_remaining > 0 ? "default" : "destructive"} className="text-xs">
                                      <Ticket className="h-3 w-3 mr-1" />
                                      {entry.client.sessions_remaining}
                                    </Badge>
                                  </div>
                                )}
                              </div>
                              <div className="flex flex-row gap-2">
                                <Button
                                  size="sm"
                                  className="h-7 text-xs"
                                  onClick={() => handlePromoteFromWaitlist(entry)}
                                  disabled={isPastSchedule}
                                >
                                  <UserPlus className="h-3 w-3 mr-1" />
                                  {t('gym.addToBooking')}
                                </Button>
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  className="h-7 text-xs"
                                  onClick={() => handleRemoveFromWaitlist(entry.id)}
                                >
                                  {t('gym.remove')}
                                </Button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
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