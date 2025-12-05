import useTranslate from "@/hook/use-translate";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

import { TodaySession } from "../../../type";

import { Calendar, CheckCircle2, User } from "lucide-react";
import { useRouter } from "next/navigation";

type BookingDayViewProps = {
  notes: string | null;
  currentDate: Date;
  editingNotes: string | null;
  setNotes: (notes: string | null) => void;
  setEditingNotes: (editingNotes: string | null) => void;
  getSessionsForDate: (date: Date) => TodaySession[];
  groupSessionsByTimeSlot: (daySessions: TodaySession[]) => { [key: string]: TodaySession[] };
  handleCancelSession: (sessionId: string) => void;
  isSessionInFuture: (scheduleDate: string, startTime: string) => boolean;
  handleSaveNotes: (sessionId: string) => void;
}

export const BookingDayView = ({ currentDate, getSessionsForDate, groupSessionsByTimeSlot, editingNotes, setEditingNotes, notes, setNotes, handleCancelSession, isSessionInFuture, handleSaveNotes }: BookingDayViewProps) => {
  const { t } = useTranslate();

  const router = useRouter();
  const daySessions = getSessionsForDate(currentDate);
  const groupedSessions = groupSessionsByTimeSlot(daySessions);
  
  if (daySessions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
        <p className="text-lg font-medium">{t('gym.noSessionsScheduled')}</p>
        <p className="text-sm text-muted-foreground">{t('gym.addSessionsToSchedule')}</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {Object.entries(groupedSessions).map(([timeKey, timeSessions]) => {
        const [startTime, endTime] = timeKey.split('-');
        return (
          <div key={timeKey} className="space-y-2">
            <div className="flex items-center justify-between p-2 bg-background border rounded-lg">
              <div className="flex items-center gap-3">
                <span className="font-medium">{startTime} - {endTime}</span>
                <Badge variant="outline" className="border-gray-400 text-primary">
                  {t('gym.sessions')}: {timeSessions.length}
                </Badge>
              </div>
            </div>
            {/* Show individual sessions details */}
            {timeSessions.map((session) => (
              <div key={session.id} className="ml-4 p-3 bg-muted rounded-lg">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    {session.client && (
                      <div className="flex items-center gap-2 mb-2">
                        <User className="h-4 w-4" />
                        <span className="font-medium cursor-pointer hover:underline hover:text-primary" onClick={() => router.push(`/clients/${session.client?.id}`)}>{session.client?.name}</span>
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${
                          session.status === 'scheduled' ? 'bg-primary/10 text-primary' :
                          session.status === 'completed' ? 'bg-success/10 text-success' :
                          'bg-muted text-muted-foreground'
                        }`}>
                          {session.status === 'scheduled' ? t('gym.scheduled') : session.status}
                        </span>
                      </div>
                    )}
                    {session.check_in_time && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                        {t('gym.checkedInAt')} {session.check_in_time}
                      </div>
                    )}
                    {session.session_notes && (
                      <p className="text-sm text-muted-foreground">{session.session_notes}</p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setEditingNotes(session.id);
                        setNotes(session.session_notes || "");
                      } }
                    >
                      {session.session_notes ? t('gym.editNotes') : t('gym.addNotes')}
                    </Button>
                    {session.status !== "completed" && (
                      <Button
                        variant="destructive"
                        size="sm"
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
                      rows={2} />
                    <div className="flex gap-2">
                      <Button onClick={() => handleSaveNotes(session.id)} size="sm">{t('gym.save')}</Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setEditingNotes(null);
                          setNotes("");
                        } }
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
      })}
    </div>
  );
};