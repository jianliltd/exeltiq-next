'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';

import { ArrowLeft } from 'lucide-react';

import { AssignedPackages } from './assigned-packages';
import { ClientInfo } from './info';
import { TransactionHistory } from './transaction-history';
import { ClientJournal } from './client-journal';
import { BookingHistory } from './booking-history';

import useTranslate from '@/hook/use-translate';

import { dashboardRoutes } from '@/path';
import { mockClients } from '../mock';
import { DeleteAlertDialog } from './delete-alert-dialog';
import { CancelBookingConfirmDialog } from './cancel-booking-confirm-dialog';

export const ClientViewDetail = () => {
  const { id } = useParams();
  const { t } = useTranslate();
  const router = useRouter();
  const client = mockClients.find((c) => c.id === id);

  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingPackages, setIsLoadingPackages] = useState(false);
  const [assignedPackages, setAssignedPackages] = useState<any[]>([]);
  const [isLoadingPayments, setIsLoadingPayments] = useState(false);
  const [paymentHistory, setPaymentHistory] = useState<any[]>([]);

  const [noteToDelete, setNoteToDelete] = useState<string | null>(null);
  const [bookingToCancel, setBookingToCancel] = useState<string | null>(null);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-12 w-64" />
        <div className="grid gap-6 md:grid-cols-2">
          <Skeleton className="h-64" />
          <Skeleton className="h-64" />
        </div>
      </div>
    );
  }

  if (!client) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">{t("clientDetail.clientNotFound")}</p>
        <Button className="mt-4" onClick={() => router.push(dashboardRoutes.clients)}>
          {t("clientDetail.backToClients")}
        </Button>
      </div>
    );
  }

  const handleAddNote = (note: string) => {
    // integration add functionality with supabase
    console.log('Add note:', note);
  };

  const handleDeleteNote = (note: any) => {
    // integration delete functionality with supabase
    setNoteToDelete(null);
  };

  const handleCancelBooking = (bookingId: string) => {
    // integration cancel booking functionality with supabase
    console.log('Cancel booking:', bookingId);
  };

  return (
    <div className="space-y-6">
      {/* title */}
      <div className="flex items-center gap-4">
        <Button 
          variant="outline" 
          size="icon"
          onClick={() => router.push(dashboardRoutes.clients)}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1">
          <h1 className="text-4xl font-bold gradient-text">{client.name}</h1>
          <p className="text-muted-foreground mt-1">{t("clientDetail.title")}</p>
        </div>
      </div>
      
      <ClientInfo client={client} />

      <AssignedPackages packages={assignedPackages} isLoading={isLoadingPackages} />
      
      <TransactionHistory payments={paymentHistory} isLoading={isLoadingPayments} />

      <ClientJournal 
        notes={client.client_notes || []} 
        onAddNote={handleAddNote}
        setNoteToDelete={setNoteToDelete}
      />

      <BookingHistory 
        bookings={client.bookings || []} 
        onCancelBooking={handleCancelBooking}
      />

      {/* Delete Note Confirmation Dialog */}
      <DeleteAlertDialog
        open={!!noteToDelete}
        onOpenChange={(open) => !open && setNoteToDelete(null)}
        onConfirm={() => noteToDelete && handleDeleteNote(noteToDelete)}
        title={t("clientDetail.deleteNote")}
        description={t("clientDetail.deleteNoteConfirm")}
      />

      {/* Cancel Booking Confirmation Dialog */}
      <CancelBookingConfirmDialog
        bookingToCancel={bookingToCancel}
        bookings={client.bookings || []}
        onOpenChange={(open) => !open && setBookingToCancel(null)}
        onConfirm={handleCancelBooking}
      />
    </div>
  );
};

export default ClientViewDetail;