'use client';

import { parseISO } from 'date-fns';

import { DeleteAlertDialog } from '../delete-alert-dialog';
import useTranslate from '@/hook/use-translate';

interface CancelBookingConfirmDialogProps {
  bookingToCancel: string | null;
  bookings: any[];
  onOpenChange: (open: boolean) => void;
  onConfirm: (bookingId: string) => void;
}

export const CancelBookingConfirmDialog = ({
  bookingToCancel,
  bookings,
  onOpenChange,
  onConfirm,
}: CancelBookingConfirmDialogProps) => {
  const { t } = useTranslate();

  const isBookingInFuture = (scheduleDate: string, startTime: string) => {
    const bookingDateTime = parseISO(`${scheduleDate}T${startTime}`);
    return bookingDateTime > new Date();
  };

  const booking = bookings?.find((b: any) => b.id === bookingToCancel);
  const isFutureBooking = booking && isBookingInFuture(booking.schedule_date, booking.start_time);

  return (
    <DeleteAlertDialog
      open={!!bookingToCancel}
      onOpenChange={onOpenChange}
      onConfirm={() => bookingToCancel && onConfirm(bookingToCancel)}
      title={t("clientDetail.cancelBooking")}
      description={t("clientDetail.cancelBookingConfirm")}
      additionalDescription={
        isFutureBooking ? (
          <span className="block mt-2 font-medium">{t("clientDetail.refundWaitlistPromotion")}</span>
        ) : null
      }
      cancelText={t("clientDetail.keepBooking")}
      confirmText={t("clientDetail.cancelBooking")}
    />
  );
};
