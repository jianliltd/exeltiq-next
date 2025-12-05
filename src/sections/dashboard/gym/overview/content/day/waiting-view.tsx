import useTranslate from "@/hook/use-translate";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import { WaitlistEntry } from "../../../type";

import { Calendar, Trash2, User, UserPlus } from "lucide-react";
import { format, isPast, parseISO } from "date-fns";
import { useRouter } from "next/navigation";

type WaitingDayViewProps = {
  getWaitlistForDate: (date: Date) => WaitlistEntry[];
  groupWaitlistByTimeSlot: (dayWaitlist: WaitlistEntry[]) => { [key: string]: WaitlistEntry[] };
  currentDate: Date;
  handlePromoteFromWaitlist: (entry: WaitlistEntry) => void;
  handleRemoveFromWaitlist: (entryId: string) => void;
}


export const WaitingDayView = ({ getWaitlistForDate, groupWaitlistByTimeSlot, currentDate, handlePromoteFromWaitlist, handleRemoveFromWaitlist }: WaitingDayViewProps) => {
  const { t } = useTranslate();
  const router = useRouter();
  const dayWaitlist = getWaitlistForDate(currentDate);
  const groupedWaitlist = groupWaitlistByTimeSlot(dayWaitlist);
  
  if (dayWaitlist.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
        <p className="text-lg font-medium">{t('gym.noWaitlistEntries')}</p>
        <p className="text-sm text-muted-foreground text-center">{t('gym.waitlistEntriesDesc')}</p>
      </div>
    );
  }
  return (
    <div className="space-y-3">
      {Object.entries(groupedWaitlist).map(([timeKey, timeEntries]) => {
        const [startTime, endTime] = timeKey.split('-');
        return (
          <div key={timeKey} className="space-y-2">
            <div className="flex items-center justify-between p-2 bg-background border rounded-lg">
              <div className="flex items-center gap-3">
                <span className="font-medium">{startTime} - {endTime}</span>
                <Badge variant="outline" className="border-amber-400 text-amber-600">
                  Waitlist: {timeEntries.length}
                </Badge>
              </div>
            </div>
            {/* Show individual waitlist entries */}
            {timeEntries.map((entry) => {
              // Combine date and start time to check if schedule is in the past
              const scheduleDateTimeStr = `${entry.schedule_date}T${entry.schedule?.start_time || '00:00:00'}`;
              const scheduleDateTime = parseISO(scheduleDateTimeStr);
              const isPastSchedule = isPast(scheduleDateTime);
              
              return (
                <div key={entry.id} className="ml-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      {entry.client && (
                        <div className="flex items-center gap-2 mb-2">
                          <User className="h-4 w-4" />
                          <span className="font-medium cursor-pointer hover:underline hover:text-primary" onClick={() => router.push(`/clients/${entry.client?.id}`)}>
                            {entry.client.name}
                          </span>
                          <Badge variant="outline" className="bg-orange-100 hover:bg-orange-200 text-orange-800 border-orange-200">
                            {t('gym.position')}: {entry.position}
                          </Badge>
                          <Badge variant={entry.client.sessions_remaining > 0 ? "default" : "destructive"} className="text-xs">
                            {entry.client.sessions_remaining} {t('gym.sessionsLeft')}
                          </Badge>
                        </div>
                      )}
                      <div className="text-sm text-muted-foreground">
                        {t('gym.joined')}: {format(new Date(entry.created_at), "MMM d, yyyy HH:mm")}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => handlePromoteFromWaitlist(entry)}
                        disabled={isPastSchedule}
                      >
                        <UserPlus className="h-3 w-3 mr-1" />
                        {t('gym.addToBooking')}
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleRemoveFromWaitlist(entry.id)}
                      >
                        <Trash2 className="h-3 w-3 mr-1" />
                        {t('gym.remove')}
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
};