export interface TodaySession {
  id: string;
  title: string;
  start_time: string;
  end_time: string;
  schedule_date: string;
  status: string;
  session_notes: string | null;
  check_in_time: string | null;
  client: {
    id: string;
    name: string;
    email: string;
    phone: string | null;
  } | null;
}

export interface WaitlistEntry {
  id: string;
  schedule_id: string;
  schedule_date: string;
  position: number;
  created_at: string;
  client: {
    id: string;
    name: string;
    email: string;
    phone: string | null;
    sessions_remaining: number;
  } | null;
  schedule: {
    start_time: string;
    end_time: string;
  } | null;
}

export type ViewMode = "day" | "week" | "month";
export type TabMode = "bookings" | "waitlist";