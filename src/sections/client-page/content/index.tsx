import { useState } from "react";
import { SessionsState } from "./sessions-state";
import { Booking as BookingComponent } from "./booking";

interface Booking {
  id: string;
  schedule_date: string;
  start_time: string;
  end_time: string;
}

interface Waitlist {
  id: string;
  schedule_date: string;
  start_time: string;
  end_time: string;
  position: number;
}

export const Content = () => {
  // Mock data for testing - small dataset
  const [myBookings, setMyBookings] = useState<Booking[]>([
    {
      id: "1",
      schedule_date: "2024-12-10",
      start_time: "10:00:00",
      end_time: "11:00:00"
    },
    {
      id: "2",
      schedule_date: "2024-12-12",
      start_time: "14:00:00",
      end_time: "15:00:00"
    }
  ]);
  const [myWaitlist, setMyWaitlist] = useState<Waitlist[]>([
    {
      id: "w1",
      schedule_date: "2024-12-15",
      start_time: "09:00:00",
      end_time: "10:00:00",
      position: 2
    }
  ]);
  const [activeMySessionsTab, setActiveMySessionsTab] = useState<"bookings" | "waitlist">("bookings");
  const [isCancelBooking, setIsCancelBooking] = useState({ loading: false, key: null as string | null });
  const [isCancelingWaitlist, setIsCancelingWaitlist] = useState({ loading: false, key: null as string | null });

  const handleCancelBooking = async (bookingId: string) => {
    setIsCancelBooking({ loading: true, key: bookingId });
    // Add your cancel booking logic here
    // After completion, reset: setIsCancelBooking({ loading: false, key: null });
  };

  const handleCancelWaitlist = async (waitlistId: string) => {
    setIsCancelingWaitlist({ loading: true, key: waitlistId });
    // Add your cancel waitlist logic here
    // After completion, reset: setIsCancelingWaitlist({ loading: false, key: null });
  };

  const canGetRefund = (date: string, time: string): boolean => {
    // Add your refund eligibility logic here
    // For example: check if the session is more than 24 hours away
    const sessionDateTime = new Date(`${date}T${time}`);
    const now = new Date();
    const hoursUntilSession = (sessionDateTime.getTime() - now.getTime()) / (1000 * 60 * 60);
    return hoursUntilSession >= 24;
  };

  return (
    <div className="max-w-7xl mx-auto space-y-3">
      <SessionsState 
        myBookings={myBookings}
        myWaitlist={myWaitlist}
        activeMySessionsTab={activeMySessionsTab}
        setActiveMySessionsTab={setActiveMySessionsTab}
        isCancelBooking={isCancelBooking}
        isCancelingWaitlist={isCancelingWaitlist}
        canGetRefund={canGetRefund}
        handleCancelBooking={handleCancelBooking}
        handleCancelWaitlist={handleCancelWaitlist}
        loading={false}
        key={null}
      />
      <BookingComponent />
    </div>
  );
};