import { useRouter } from "next/navigation";

import { isSameDay, startOfWeek } from "date-fns";
import { eachDayOfInterval } from "date-fns";
import { endOfWeek } from "date-fns";

import useTranslate from "@/hook/use-translate";
import { CheckCircle2, Clock, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { TodaySession } from "../../../type";

type BookingWeekViewProps = {
  currentDate: Date;
  editingNotes: string | null;
  setEditingNotes: (editingNotes: string | null) => void;
  notes: string | null;
  setNotes: (notes: string | null) => void;
  getSessionsForDate: (date: Date) => TodaySession[];
  groupSessionsByTimeSlot: (daySessions: TodaySession[]) => { [key: string]: TodaySession[] };
  handleCancelSession: (sessionId: string) => void;
  isSessionInFuture: (scheduleDate: string, startTime: string) => boolean;
  handleSaveNotes: (sessionId: string) => void;
}

export const BookingWeekView = ({ currentDate, editingNotes, setEditingNotes, notes, setNotes, getSessionsForDate, groupSessionsByTimeSlot, handleCancelSession, isSessionInFuture, handleSaveNotes }: BookingWeekViewProps) => {
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
      const daySessions = getSessionsForDate(day);
      const groupedSessions = groupSessionsByTimeSlot(daySessions);
      const isToday = isSameDay(day, new Date());
      
      return (
        <div key={day.toISOString()} className={`border rounded-lg p-4 ${isToday ? "border-primary bg-primary/5" : ""}`}>
          <div className="flex items-center gap-2 mb-3">
            <Clock className="h-4 w-4" />
            <h3 className="text-base font-semibold">
              {day.toLocaleDateString('en-US', { weekday: 'long' })} <span className="text-muted-foreground font-normal">{day.toLocaleDateString('en-US', { month: 'numeric', day: 'numeric' })}</span>
            </h3>
          </div>
          <div className="space-y-3">
            {daySessions.length === 0 ? (
              <p className="text-sm text-muted-foreground italic">{t('gym.noSlots')}</p>
            ) : (
              Object.entries(groupedSessions).map(([timeKey, timeSessions]) => {
                const [startTime, endTime] = timeKey.split('-');
                return (
                  <div key={timeKey} className="space-y-2">
                    <div className="flex items-center justify-between p-2 bg-background border rounded-lg">
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-medium">{startTime} - {endTime}</span>
                        <Badge variant="outline" className="border-gray-400 text-primary text-xs">
                          {t('gym.sessions')}: {timeSessions.length}
                        </Badge>
                      </div>
                    </div>
                    {/* Show individual sessions details */}
                    {timeSessions.map((session) => (
                      <div key={session.id} className="ml-4 p-2 bg-muted rounded-lg">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            {session.client && (
                              <div className="flex items-center gap-2 mb-1">
                                <User className="h-3 w-3" />
                                <span className="text-sm font-medium cursor-pointer hover:underline hover:text-primary" onClick={() => router.push(`/clients/${session.client?.id}`)}>{session.client?.name}</span>
                                <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${
                                  session.status === 'scheduled' ? 'bg-primary/10 text-primary' :
                                  session.status === 'completed' ? 'bg-success/10 text-success' :
                                  'bg-muted text-muted-foreground'
                                }`}>
                                  {session.status}
                                </span>
                              </div>
                            )}
                            {session.check_in_time && (
                              <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                                <CheckCircle2 className="h-3 w-3 text-green-500" />
                                {t('gym.checkedInAt')} {session.check_in_time}
                              </div>
                            )}
                            {session.session_notes && (
                              <p className="text-xs text-muted-foreground">{session.session_notes}</p>
                            )}
                          </div>
                          <div className="flex gap-1">
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-7 text-xs"
                              onClick={() => {
                                setEditingNotes(session.id);
                                setNotes(session.session_notes || "");
                              }}
                            >
                              {session.session_notes ? t('gym.edit') : t('gym.addNotes')}
                            </Button>
                            {session.status !== "completed" && (
                              <Button
                                variant="destructive"
                                size="sm"
                                className="h-7 text-xs"
                                onClick={() => handleCancelSession(session.id)}
                              >
                                {isSessionInFuture(session.schedule_date, session.start_time) ? t('gym.cancelWithRefund') : t('gym.cancel')}
                              </Button>
                            )}
                          </div>
                        </div>
                        {editingNotes === session.id && (
                          <div className="mt-2 space-y-2">
                            <Textarea
                              placeholder={t('gym.addSessionNotes')}
                              value={notes || ""}
                              onChange={(e) => setNotes(e.target.value)}
                              rows={2}
                              className="text-xs"
                            />
                            <div className="flex gap-2">
                              <Button onClick={() => handleSaveNotes(session.id)} size="sm" className="h-7 text-xs">{t('gym.save')}</Button>
                              <Button 
                                variant="outline" 
                                size="sm"
                                className="h-7 text-xs"
                                onClick={() => {
                                  setEditingNotes(null);
                                  setNotes("");
                                }}
                              >
                                {t('gym.cancel')}
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
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