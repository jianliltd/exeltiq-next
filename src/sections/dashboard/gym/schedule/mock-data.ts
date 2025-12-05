import { TodaySession } from "../type";

/**
 * Mock session booking data for testing
 * This represents actual bookings/sessions (different from schedule slots)
 * Used primarily for the Overview page, not the Schedule management page
 */

// Helper function to get date string in YYYY-MM-DD format
const getDateString = (daysFromToday: number): string => {
  const date = new Date();
  date.setDate(date.getDate() + daysFromToday);
  return date.toISOString().split('T')[0];
};

// Helper function to get time string for check-in
const getCheckInTime = (daysFromToday: number, hour: number, minute: number): string => {
  const date = new Date();
  date.setDate(date.getDate() + daysFromToday);
  date.setHours(hour, minute, 0, 0);
  return date.toISOString();
};

export const mockSessions: TodaySession[] = [
  // Today's sessions
  {
    id: "session-1",
    title: "Morning Workout",
    start_time: "08:00",
    end_time: "09:00",
    schedule_date: getDateString(0),
    status: "completed",
    session_notes: "Great form on squats today!",
    check_in_time: getCheckInTime(0, 8, 5),
    client: {
      id: "client-1",
      name: "John Smith",
      email: "john.smith@example.com",
      phone: "+1234567890",
    },
  },
  {
    id: "session-2",
    title: "Morning Workout",
    start_time: "08:00",
    end_time: "09:00",
    schedule_date: getDateString(0),
    status: "completed",
    session_notes: null,
    check_in_time: getCheckInTime(0, 8, 3),
    client: {
      id: "client-2",
      name: "Sarah Johnson",
      email: "sarah.j@example.com",
      phone: "+1234567891",
    },
  },
  {
    id: "session-3",
    title: "Midday Session",
    start_time: "12:00",
    end_time: "13:00",
    schedule_date: getDateString(0),
    status: "scheduled",
    session_notes: null,
    check_in_time: null,
    client: {
      id: "client-3",
      name: "Mike Davis",
      email: "mike.davis@example.com",
      phone: "+1234567892",
    },
  },
  {
    id: "session-4",
    title: "Evening Session",
    start_time: "18:00",
    end_time: "19:00",
    schedule_date: getDateString(0),
    status: "scheduled",
    session_notes: "First session of the week",
    check_in_time: null,
    client: {
      id: "client-4",
      name: "Emily Brown",
      email: "emily.brown@example.com",
      phone: "+1234567893",
    },
  },
  {
    id: "session-5",
    title: "Evening Session",
    start_time: "18:00",
    end_time: "19:00",
    schedule_date: getDateString(0),
    status: "scheduled",
    session_notes: null,
    check_in_time: null,
    client: {
      id: "client-5",
      name: "David Wilson",
      email: "david.wilson@example.com",
      phone: "+1234567894",
    },
  },

  // Tomorrow's sessions
  {
    id: "session-8",
    title: "Early Morning",
    start_time: "06:00",
    end_time: "07:00",
    schedule_date: getDateString(1),
    status: "scheduled",
    session_notes: null,
    check_in_time: null,
    client: {
      id: "client-7",
      name: "James Martinez",
      email: "james.martinez@example.com",
      phone: "+1234567896",
    },
  },
  {
    id: "session-9",
    title: "Morning Session",
    start_time: "10:00",
    end_time: "11:00",
    schedule_date: getDateString(1),
    status: "scheduled",
    session_notes: "Focus on upper body",
    check_in_time: null,
    client: {
      id: "client-2",
      name: "Sarah Johnson",
      email: "sarah.j@example.com",
      phone: "+1234567891",
    },
  },

  // Next week sessions
  {
    id: "session-24",
    title: "Morning Session",
    start_time: "08:00",
    end_time: "09:00",
    schedule_date: getDateString(7),
    status: "scheduled",
    session_notes: null,
    check_in_time: null,
    client: {
      id: "client-9",
      name: "Robert Thompson",
      email: "robert.thompson@example.com",
      phone: "+1234567898",
    },
  },
];

