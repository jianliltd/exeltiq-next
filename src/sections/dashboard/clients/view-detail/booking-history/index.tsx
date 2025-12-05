'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import { Calendar } from 'lucide-react';
import { parseISO } from 'date-fns';

import useTranslate from '@/hook/use-translate';

interface BookingHistoryProps {
  bookings: any[];
  onCancelBooking?: (bookingId: string) => void;
}

export const BookingHistory = ({ bookings, onCancelBooking }: BookingHistoryProps) => {
  const { t } = useTranslate();

  const isBookingInFuture = (scheduleDate: string, startTime: string) => {
    const bookingDateTime = parseISO(`${scheduleDate}T${startTime}`);
    return bookingDateTime > new Date();
  };

  const sortedBookings = bookings
    ? [...bookings].sort((a: any, b: any) => new Date(b.schedule_date).getTime() - new Date(a.schedule_date).getTime())
    : [];

  return (
    <Card className="shadow-elevated border-border/50 bg-card/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          {t("clientDetail.bookingHistory")}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {sortedBookings.length > 0 ? (
          <div className="space-y-2">
            {sortedBookings.map((booking: any) => {
              const isFuture = isBookingInFuture(booking.schedule_date, booking.start_time);
              const badgeStatus = booking.status === 'scheduled' && !isFuture ? 'past' : booking.status;

              return (
                <div key={booking.id} className="p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold">{booking.title}</p>
                        <span className="text-xs text-muted-foreground font-normal">
                          • {booking.schedule_date}
                        </span>
                        <p className="text-xs text-muted-foreground">
                          • {booking.start_time} - {booking.end_time}
                        </p>
                      </div>
                      {booking?.description && (
                        <p className="text-sm text-muted-foreground mt-1">{booking.description}</p>
                      )}
                      {booking?.session_notes && (
                        <p className="text-sm text-muted-foreground mt-1">{booking.session_notes}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${
                        badgeStatus === 'past' ? 'bg-muted text-muted-foreground' :
                        badgeStatus === 'scheduled' ? 'bg-primary/10 text-primary' :
                        badgeStatus === 'completed' ? 'bg-success/10 text-success' :
                        'bg-muted text-muted-foreground'
                      }`}>
                        {badgeStatus === 'past' ? t("clientDetail.past") : badgeStatus}
                      </span>
                      {booking.status === 'scheduled' && (
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => onCancelBooking?.(booking.id)}
                          className="h-8 text-xs"
                        >
                          {isFuture ? t("clientDetail.cancelWithRefund") : t("clientDetail.remove")}
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-center text-muted-foreground py-8">{t("clientDetail.noBookings")}</p>
        )}
      </CardContent>
    </Card>
  );
};
