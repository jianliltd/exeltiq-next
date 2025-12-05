import { Calendar, Settings, Users } from "lucide-react";
import { TodaySession, WaitlistEntry } from './type';

export const GYM_TABS = [
  {
    value: "overview",
    labelKey: 'gym.overview',
    icon: Calendar,
  },
  {
    value: "schedule",
    labelKey: 'gym.schedule',
    icon: Calendar,
  },
  {
    value: "clients",
    labelKey: 'gym.clients',
    icon: Users,
  },
  {
    value: "settings",
    labelKey: 'gym.settings',
    icon: Settings,
  },
];

// Helper to get dates relative to today
const getDateString = (daysOffset: number = 0) => {
  const date = new Date();
  date.setDate(date.getDate() + daysOffset);
  return date.toISOString().split('T')[0];
};

export const mockSessions: TodaySession[] = [
  // Today's sessions
  {
    id: 's1',
    title: 'Morning HIIT',
    start_time: '07:00',
    end_time: '08:00',
    schedule_date: getDateString(0),
    status: 'completed',
    session_notes: 'Great energy today!',
    check_in_time: '06:55',
    client: {
      id: 'c1',
      name: 'Sarah Johnson',
      email: 'sarah.johnson@email.com',
      phone: '+1 (555) 123-4567',
    },
  },
  {
    id: 's2',
    title: 'Strength Training',
    start_time: '09:00',
    end_time: '10:00',
    schedule_date: getDateString(0),
    status: 'checked_in',
    session_notes: null,
    check_in_time: '08:58',
    client: {
      id: 'c2',
      name: 'Michael Chen',
      email: 'michael.chen@email.com',
      phone: '+1 (555) 234-5678',
    },
  },
  {
    id: 's3',
    title: 'Yoga Session',
    start_time: '11:00',
    end_time: '12:00',
    schedule_date: getDateString(0),
    status: 'scheduled',
    session_notes: null,
    check_in_time: null,
    client: {
      id: 'c3',
      name: 'Emma Williams',
      email: 'emma.w@email.com',
      phone: '+1 (555) 345-6789',
    },
  },
  {
    id: 's4',
    title: 'Personal Training',
    start_time: '14:00',
    end_time: '15:00',
    schedule_date: getDateString(0),
    status: 'scheduled',
    session_notes: null,
    check_in_time: null,
    client: {
      id: 'c6',
      name: 'David Kim',
      email: 'david.kim@email.com',
      phone: '+1 (555) 678-9012',
    },
  },
  {
    id: 's5',
    title: 'Boxing Training',
    start_time: '16:00',
    end_time: '17:30',
    schedule_date: getDateString(0),
    status: 'scheduled',
    session_notes: null,
    check_in_time: null,
    client: {
      id: 'c4',
      name: 'James Rodriguez',
      email: 'j.rodriguez@email.com',
      phone: '+1 (555) 456-7890',
    },
  },
  // Tomorrow's sessions
  {
    id: 's6',
    title: 'Spin Class',
    start_time: '06:00',
    end_time: '07:00',
    schedule_date: getDateString(1),
    status: 'scheduled',
    session_notes: null,
    check_in_time: null,
    client: {
      id: 'c10',
      name: 'William Anderson',
      email: 'w.anderson@email.com',
      phone: '+1 (555) 012-3456',
    },
  },
  {
    id: 's7',
    title: 'Pilates',
    start_time: '08:00',
    end_time: '09:00',
    schedule_date: getDateString(1),
    status: 'scheduled',
    session_notes: null,
    check_in_time: null,
    client: {
      id: 'c3',
      name: 'Emma Williams',
      email: 'emma.w@email.com',
      phone: '+1 (555) 345-6789',
    },
  },
  {
    id: 's8',
    title: 'Zumba Class',
    start_time: '18:00',
    end_time: '19:00',
    schedule_date: getDateString(1),
    status: 'scheduled',
    session_notes: null,
    check_in_time: null,
    client: {
      id: 'c7',
      name: 'Sophie Martinez',
      email: 'sophie.m@email.com',
      phone: '+1 (555) 789-0123',
    },
  },
  // Day after tomorrow
  {
    id: 's9',
    title: 'CrossFit',
    start_time: '07:00',
    end_time: '08:00',
    schedule_date: getDateString(2),
    status: 'scheduled',
    session_notes: null,
    check_in_time: null,
    client: {
      id: 'c8',
      name: 'Robert Taylor',
      email: 'r.taylor@email.com',
      phone: '+1 (555) 890-1234',
    },
  },
  {
    id: 's10',
    title: 'Meditation',
    start_time: '09:00',
    end_time: '10:00',
    schedule_date: getDateString(2),
    status: 'scheduled',
    session_notes: null,
    check_in_time: null,
    client: {
      id: 'c9',
      name: 'Isabella Garcia',
      email: 'isabella.g@email.com',
      phone: '+1 (555) 901-2345',
    },
  },
  // Past sessions (yesterday)
  {
    id: 's11',
    title: 'Morning Cardio',
    start_time: '07:00',
    end_time: '08:00',
    schedule_date: getDateString(-1),
    status: 'completed',
    session_notes: 'Improved endurance',
    check_in_time: '06:50',
    client: {
      id: 'c1',
      name: 'Sarah Johnson',
      email: 'sarah.johnson@email.com',
      phone: '+1 (555) 123-4567',
    },
  },
  {
    id: 's12',
    title: 'Evening Strength',
    start_time: '18:00',
    end_time: '19:00',
    schedule_date: getDateString(-1),
    status: 'no_show',
    session_notes: 'Client did not show up',
    check_in_time: null,
    client: {
      id: 'c5',
      name: 'Olivia Brown',
      email: 'olivia.brown@email.com',
      phone: '+1 (555) 567-8901',
    },
  },
  // Sessions for next week
  {
    id: 's13',
    title: 'Personal Training',
    start_time: '10:00',
    end_time: '11:00',
    schedule_date: getDateString(5),
    status: 'scheduled',
    session_notes: null,
    check_in_time: null,
    client: {
      id: 'c6',
      name: 'David Kim',
      email: 'david.kim@email.com',
      phone: '+1 (555) 678-9012',
    },
  },
  {
    id: 's14',
    title: 'Group Fitness',
    start_time: '17:00',
    end_time: '18:00',
    schedule_date: getDateString(6),
    status: 'scheduled',
    session_notes: null,
    check_in_time: null,
    client: {
      id: 'c7',
      name: 'Sophie Martinez',
      email: 'sophie.m@email.com',
      phone: '+1 (555) 789-0123',
    },
  },
];

export const mockWaitlist: WaitlistEntry[] = [
  {
    id: 'w1',
    schedule_id: 'sch1',
    schedule_date: getDateString(0),
    position: 1,
    created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    client: {
      id: 'c5',
      name: 'Olivia Brown',
      email: 'olivia.brown@email.com',
      phone: '+1 (555) 567-8901',
      sessions_remaining: 3,
    },
    schedule: {
      start_time: '09:00',
      end_time: '10:00',
    },
  },
  {
    id: 'w2',
    schedule_id: 'sch1',
    schedule_date: getDateString(0),
    position: 2,
    created_at: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(), // 1 hour ago
    client: {
      id: 'c8',
      name: 'Robert Taylor',
      email: 'r.taylor@email.com',
      phone: '+1 (555) 890-1234',
      sessions_remaining: 4,
    },
    schedule: {
      start_time: '09:00',
      end_time: '10:00',
    },
  },
  {
    id: 'w3',
    schedule_id: 'sch2',
    schedule_date: getDateString(0),
    position: 1,
    created_at: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30 mins ago
    client: {
      id: 'c10',
      name: 'William Anderson',
      email: 'w.anderson@email.com',
      phone: '+1 (555) 012-3456',
      sessions_remaining: 7,
    },
    schedule: {
      start_time: '14:00',
      end_time: '15:00',
    },
  },
  {
    id: 'w4',
    schedule_id: 'sch3',
    schedule_date: getDateString(1),
    position: 1,
    created_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), // 4 hours ago
    client: {
      id: 'c9',
      name: 'Isabella Garcia',
      email: 'isabella.g@email.com',
      phone: '+1 (555) 901-2345',
      sessions_remaining: 7,
    },
    schedule: {
      start_time: '08:00',
      end_time: '09:00',
    },
  },
  {
    id: 'w5',
    schedule_id: 'sch4',
    schedule_date: getDateString(2),
    position: 1,
    created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    client: {
      id: 'c1',
      name: 'Sarah Johnson',
      email: 'sarah.johnson@email.com',
      phone: '+1 (555) 123-4567',
      sessions_remaining: 12,
    },
    schedule: {
      start_time: '11:00',
      end_time: '12:00',
    },
  },
  {
    id: 'w6',
    schedule_id: 'sch4',
    schedule_date: getDateString(2),
    position: 2,
    created_at: new Date(Date.now() - 20 * 60 * 60 * 1000).toISOString(), // 20 hours ago
    client: {
      id: 'c2',
      name: 'Michael Chen',
      email: 'michael.chen@email.com',
      phone: '+1 (555) 234-5678',
      sessions_remaining: 5,
    },
    schedule: {
      start_time: '11:00',
      end_time: '12:00',
    },
  },
];

