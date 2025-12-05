/**
 * Mock schedule slot data for testing the schedule management views
 * These represent recurring time slots, not individual bookings
 */

export interface MockScheduleSlot {
  id: string;
  day_of_week: number; // 1 = Monday, 2 = Tuesday, ..., 7 = Sunday
  start_time: string;
  end_time: string;
  max_capacity: number;
  is_active: boolean;
  schedule_date: string | null; // null for recurring, date string for one-time
  repeat_id: string | null;
  repeat_type: string | null; // 'daily' | 'weekly' | 'monthly' | null
}

export const mockScheduleSlots: MockScheduleSlot[] = [
  // ========== MONDAY (day_of_week: 1) ==========
  {
    id: "schedule-mon-1",
    day_of_week: 1,
    start_time: "06:00",
    end_time: "07:00",
    max_capacity: 5,
    is_active: true,
    schedule_date: null,
    repeat_id: "repeat-mon-morning",
    repeat_type: "weekly",
  },
  {
    id: "schedule-mon-2",
    day_of_week: 1,
    start_time: "09:00",
    end_time: "10:00",
    max_capacity: 1, // Personal training
    is_active: true,
    schedule_date: null,
    repeat_id: "repeat-mon-pt",
    repeat_type: "weekly",
  },
  {
    id: "schedule-mon-3",
    day_of_week: 1,
    start_time: "10:00",
    end_time: "11:00",
    max_capacity: 8,
    is_active: true,
    schedule_date: null,
    repeat_id: "repeat-mon-mid",
    repeat_type: "weekly",
  },
  {
    id: "schedule-mon-4",
    day_of_week: 1,
    start_time: "12:00",
    end_time: "13:00",
    max_capacity: 6,
    is_active: true,
    schedule_date: null,
    repeat_id: "repeat-mon-lunch",
    repeat_type: "weekly",
  },
  {
    id: "schedule-mon-5",
    day_of_week: 1,
    start_time: "17:00",
    end_time: "18:00",
    max_capacity: 12,
    is_active: true,
    schedule_date: null,
    repeat_id: "repeat-mon-evening",
    repeat_type: "weekly",
  },
  {
    id: "schedule-mon-6",
    day_of_week: 1,
    start_time: "18:00",
    end_time: "19:30",
    max_capacity: 10,
    is_active: false, // Disabled slot
    schedule_date: null,
    repeat_id: "repeat-mon-late",
    repeat_type: "weekly",
  },

  // ========== TUESDAY (day_of_week: 2) ==========
  {
    id: "schedule-tue-1",
    day_of_week: 2,
    start_time: "07:00",
    end_time: "08:00",
    max_capacity: 8,
    is_active: true,
    schedule_date: null,
    repeat_id: "repeat-tue-early",
    repeat_type: "weekly",
  },
  {
    id: "schedule-tue-2",
    day_of_week: 2,
    start_time: "08:00",
    end_time: "09:00",
    max_capacity: 6,
    is_active: true,
    schedule_date: null,
    repeat_id: "repeat-tue-morning",
    repeat_type: "weekly",
  },
  {
    id: "schedule-tue-3",
    day_of_week: 2,
    start_time: "12:00",
    end_time: "13:30",
    max_capacity: 10,
    is_active: true,
    schedule_date: null,
    repeat_id: "repeat-tue-lunch",
    repeat_type: "weekly",
  },
  {
    id: "schedule-tue-4",
    day_of_week: 2,
    start_time: "17:00",
    end_time: "18:00",
    max_capacity: 15,
    is_active: true,
    schedule_date: null,
    repeat_id: "repeat-tue-evening",
    repeat_type: "weekly",
  },
  {
    id: "schedule-tue-5",
    day_of_week: 2,
    start_time: "19:00",
    end_time: "20:00",
    max_capacity: 8,
    is_active: true,
    schedule_date: null,
    repeat_id: "repeat-tue-night",
    repeat_type: "weekly",
  },

  // ========== WEDNESDAY (day_of_week: 3) ==========
  {
    id: "schedule-wed-1",
    day_of_week: 3,
    start_time: "06:00",
    end_time: "07:00",
    max_capacity: 6,
    is_active: true,
    schedule_date: null,
    repeat_id: "repeat-wed-early",
    repeat_type: "weekly",
  },
  {
    id: "schedule-wed-2",
    day_of_week: 3,
    start_time: "09:00",
    end_time: "10:00",
    max_capacity: 1, // Personal training
    is_active: true,
    schedule_date: null,
    repeat_id: "repeat-wed-pt",
    repeat_type: "weekly",
  },
  {
    id: "schedule-wed-3",
    day_of_week: 3,
    start_time: "10:00",
    end_time: "11:00",
    max_capacity: 8,
    is_active: true,
    schedule_date: null,
    repeat_id: "repeat-wed-mid",
    repeat_type: "weekly",
  },
  {
    id: "schedule-wed-4",
    day_of_week: 3,
    start_time: "12:00",
    end_time: "13:00",
    max_capacity: 12,
    is_active: true,
    schedule_date: null,
    repeat_id: "repeat-wed-lunch",
    repeat_type: "weekly",
  },
  {
    id: "schedule-wed-5",
    day_of_week: 3,
    start_time: "18:00",
    end_time: "19:00",
    max_capacity: 10,
    is_active: true,
    schedule_date: null,
    repeat_id: "repeat-wed-evening",
    repeat_type: "weekly",
  },

  // ========== THURSDAY (day_of_week: 4) ==========
  {
    id: "schedule-thu-1",
    day_of_week: 4,
    start_time: "07:00",
    end_time: "08:00",
    max_capacity: 8,
    is_active: true,
    schedule_date: null,
    repeat_id: "repeat-thu-morning",
    repeat_type: "weekly",
  },
  {
    id: "schedule-thu-2",
    day_of_week: 4,
    start_time: "08:00",
    end_time: "09:30",
    max_capacity: 7,
    is_active: false, // Disabled
    schedule_date: null,
    repeat_id: "repeat-thu-mid",
    repeat_type: "weekly",
  },
  {
    id: "schedule-thu-3",
    day_of_week: 4,
    start_time: "12:00",
    end_time: "13:00",
    max_capacity: 10,
    is_active: true,
    schedule_date: null,
    repeat_id: "repeat-thu-lunch",
    repeat_type: "weekly",
  },
  {
    id: "schedule-thu-4",
    day_of_week: 4,
    start_time: "17:00",
    end_time: "18:00",
    max_capacity: 15,
    is_active: true,
    schedule_date: null,
    repeat_id: "repeat-thu-evening",
    repeat_type: "weekly",
  },
  {
    id: "schedule-thu-5",
    day_of_week: 4,
    start_time: "19:00",
    end_time: "20:30",
    max_capacity: 12,
    is_active: true,
    schedule_date: null,
    repeat_id: "repeat-thu-night",
    repeat_type: "weekly",
  },

  // ========== FRIDAY (day_of_week: 5) ==========
  {
    id: "schedule-fri-1",
    day_of_week: 5,
    start_time: "06:00",
    end_time: "07:00",
    max_capacity: 8,
    is_active: true,
    schedule_date: null,
    repeat_id: "repeat-fri-early",
    repeat_type: "weekly",
  },
  {
    id: "schedule-fri-2",
    day_of_week: 5,
    start_time: "09:00",
    end_time: "10:00",
    max_capacity: 1, // Personal training
    is_active: true,
    schedule_date: null,
    repeat_id: "repeat-fri-pt",
    repeat_type: "weekly",
  },
  {
    id: "schedule-fri-3",
    day_of_week: 5,
    start_time: "12:00",
    end_time: "13:00",
    max_capacity: 10,
    is_active: true,
    schedule_date: null,
    repeat_id: "repeat-fri-lunch",
    repeat_type: "weekly",
  },
  {
    id: "schedule-fri-4",
    day_of_week: 5,
    start_time: "17:00",
    end_time: "18:00",
    max_capacity: 15,
    is_active: true,
    schedule_date: null,
    repeat_id: "repeat-fri-evening",
    repeat_type: "weekly",
  },
  {
    id: "schedule-fri-5",
    day_of_week: 5,
    start_time: "18:00",
    end_time: "19:30",
    max_capacity: 14,
    is_active: true,
    schedule_date: null,
    repeat_id: "repeat-fri-late",
    repeat_type: "weekly",
  },

  // ========== SATURDAY (day_of_week: 6) ==========
  {
    id: "schedule-sat-1",
    day_of_week: 6,
    start_time: "08:00",
    end_time: "09:00",
    max_capacity: 10,
    is_active: true,
    schedule_date: null,
    repeat_id: "repeat-sat-morning",
    repeat_type: "weekly",
  },
  {
    id: "schedule-sat-2",
    day_of_week: 6,
    start_time: "09:00",
    end_time: "10:00",
    max_capacity: 10,
    is_active: true,
    schedule_date: null,
    repeat_id: "repeat-sat-mid",
    repeat_type: "weekly",
  },
  {
    id: "schedule-sat-3",
    day_of_week: 6,
    start_time: "10:00",
    end_time: "11:00",
    max_capacity: 8,
    is_active: true,
    schedule_date: null,
    repeat_id: "repeat-sat-late",
    repeat_type: "weekly",
  },
  {
    id: "schedule-sat-4",
    day_of_week: 6,
    start_time: "11:00",
    end_time: "12:00",
    max_capacity: 6,
    is_active: false, // Disabled
    schedule_date: null,
    repeat_id: "repeat-sat-noon",
    repeat_type: "weekly",
  },

  // ========== SUNDAY (day_of_week: 7) ==========
  {
    id: "schedule-sun-1",
    day_of_week: 7,
    start_time: "09:00",
    end_time: "10:00",
    max_capacity: 8,
    is_active: true,
    schedule_date: null,
    repeat_id: "repeat-sun-morning",
    repeat_type: "weekly",
  },
  {
    id: "schedule-sun-2",
    day_of_week: 7,
    start_time: "10:00",
    end_time: "11:30",
    max_capacity: 10,
    is_active: true,
    schedule_date: null,
    repeat_id: "repeat-sun-mid",
    repeat_type: "weekly",
  },
  {
    id: "schedule-sun-3",
    day_of_week: 7,
    start_time: "11:30",
    end_time: "12:30",
    max_capacity: 6,
    is_active: true,
    schedule_date: null,
    repeat_id: "repeat-sun-late",
    repeat_type: "weekly",
  },

  // ========== ONE-TIME SPECIAL EVENTS ==========
  // Example: Special holiday class
  {
    id: "schedule-special-1",
    day_of_week: 3, // Wednesday
    start_time: "15:00",
    end_time: "16:30",
    max_capacity: 20,
    is_active: true,
    schedule_date: "2025-12-25", // Christmas special
    repeat_id: null,
    repeat_type: null,
  },
];

/**
 * Helper function to get schedules for a specific day of week
 */
export const getSchedulesForDayOfWeek = (dayOfWeek: number): MockScheduleSlot[] => {
  return mockScheduleSlots.filter(slot => slot.day_of_week === dayOfWeek);
};

/**
 * Helper function to get active schedules only
 */
export const getActiveSchedules = (): MockScheduleSlot[] => {
  return mockScheduleSlots.filter(slot => slot.is_active);
};

/**
 * Helper function to get schedules by time range
 */
export const getSchedulesByTimeRange = (startHour: number, endHour: number): MockScheduleSlot[] => {
  return mockScheduleSlots.filter(slot => {
    const slotStartHour = parseInt(slot.start_time.split(':')[0]);
    return slotStartHour >= startHour && slotStartHour < endHour;
  });
};

/**
 * Summary statistics
 */
export const scheduleStats = {
  total: mockScheduleSlots.length,
  active: mockScheduleSlots.filter(s => s.is_active).length,
  inactive: mockScheduleSlots.filter(s => !s.is_active).length,
  byDay: {
    monday: getSchedulesForDayOfWeek(1).length,
    tuesday: getSchedulesForDayOfWeek(2).length,
    wednesday: getSchedulesForDayOfWeek(3).length,
    thursday: getSchedulesForDayOfWeek(4).length,
    friday: getSchedulesForDayOfWeek(5).length,
    saturday: getSchedulesForDayOfWeek(6).length,
    sunday: getSchedulesForDayOfWeek(7).length,
  },
  totalCapacity: mockScheduleSlots.reduce((sum, slot) => sum + slot.max_capacity, 0),
};

