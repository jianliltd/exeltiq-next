import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Loader2 } from "lucide-react";
import useTranslate from "@/hook/use-translate";
import { useToast } from "@/hook/use-toast";

interface AddScheduleSlotDialogProps {
  companyId: string;
  userId: string | null;
  schedules: Array<{
    schedule_date: string | null;
    start_time: string;
    end_time: string;
  }>;
  onScheduleAdded: () => void;
}

const getTodayDate = () => {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
};

const formatDateKey = (date: Date) => {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
};

export function AddScheduleSlotDialog({ companyId, userId, schedules, onScheduleAdded }: AddScheduleSlotDialogProps) {
  const { toast } = useToast();
  const { t } = useTranslate();
  const [open, setOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(getTodayDate());
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("10:00");
  const [maxCapacity, setMaxCapacity] = useState("1");
  const [repeatOption, setRepeatOption] = useState("none");
  const [repeatUntil, setRepeatUntil] = useState("");
  const [isAddingSlot, setIsAddingSlot] = useState(false);

  // Automatically set repeatUntil to 1 year from selectedDate when repeat option is selected
  useEffect(() => {
    if (repeatOption !== "none") {
      const start = new Date(selectedDate + 'T00:00:00');
      const oneYearLater = new Date(start);
      oneYearLater.setFullYear(start.getFullYear() + 1);
      const yyyy = oneYearLater.getFullYear();
      const mm = String(oneYearLater.getMonth() + 1).padStart(2, '0');
      const dd = String(oneYearLater.getDate()).padStart(2, '0');
      setRepeatUntil(`${yyyy}-${mm}-${dd}`);
    } else {
      setRepeatUntil("");
    }
  }, [repeatOption, selectedDate]);

  const checkTimeOverlap = (start1: string, end1: string, start2: string, end2: string): boolean => {
    const timeToMinutes = (time: string) => {
      const [hours, minutes] = time.split(':').map(Number);
      return hours * 60 + minutes;
    };

    const start1Min = timeToMinutes(start1);
    const end1Min = timeToMinutes(end1);
    const start2Min = timeToMinutes(start2);
    const end2Min = timeToMinutes(end2);

    return start1Min < end2Min && end1Min > start2Min;
  };

  const generateRepeatDates = (startDate: string, repeatOption: string, repeatUntilDate: string): string[] => {
    const dates: string[] = [];
    const start = new Date(startDate + 'T00:00:00');
    const until = repeatUntilDate ? new Date(repeatUntilDate + 'T00:00:00') : null;
    
    if (repeatOption === "none") {
      return [startDate];
    }
    
    const endDate = until || new Date(start.getFullYear() + 1, start.getMonth(), start.getDate());
    const currentDate = new Date(start);
    
    while (currentDate <= endDate) {
      const dateStr = formatDateKey(currentDate);
      
      const isWeekend = currentDate.getDay() === 0 || currentDate.getDay() === 6;
      if (repeatOption !== "weekdays" || !isWeekend) {
        dates.push(dateStr);
      }
      
      switch (repeatOption) {
        case "daily":
          currentDate.setDate(currentDate.getDate() + 1);
          break;
        case "weekdays":
          do {
            currentDate.setDate(currentDate.getDate() + 1);
          } while (currentDate.getDay() === 0 || currentDate.getDay() === 6);
          break;
        case "weekly":
          currentDate.setDate(currentDate.getDate() + 7);
          break;
        case "monthly":
          currentDate.setMonth(currentDate.getMonth() + 1);
          break;
        default:
          return [startDate];
      }
      
      if (dates.length > 400) {
        break;
      }
    }
    
    return dates;
  };

  const handleAddSlot = async () => {
    try {
      setIsAddingSlot(true);

      if (endTime <= startTime) {
        toast({
          title: t('gym.invalidTimeRange'),
          description: t('gym.endTimeMustBeAfterStartTime'),
          variant: "destructive",
        });
        return;
      }

      const capacity = parseInt(maxCapacity);
      if (isNaN(capacity) || capacity <= 0) {
        toast({
          title: t('gym.invalidCapacity'),
          description: t('gym.capacityMustBePositive'),
          variant: "destructive",
        });
        return;
      }

      const datesToCreate = generateRepeatDates(selectedDate, repeatOption, repeatUntil);
      const now = new Date();
      let futureDates: string[];

      if (repeatOption === "none") {
        const slotDateTime = new Date(`${selectedDate}T${startTime}:00`);
        if (slotDateTime <= now) {
          toast({
            title: t('gym.invalidDateTime'),
            description: t('gym.cannotCreatePastSlot'),
            variant: "destructive",
          });
          return;
        }
        futureDates = datesToCreate;
      } else {
        futureDates = datesToCreate.filter(date => {
          const slotDateTime = new Date(`${date}T${startTime}:00`);
          return slotDateTime > now;
        });

        if (futureDates.length === 0) {
          toast({
            title: t('gym.invalidDateTime'),
            description: t('gym.allRecurringDatesInPast'),
            variant: "destructive",
          });
          return;
        }
      }
      
      const overlappingDates: string[] = [];
      for (const date of futureDates) {
        const dateSchedules = schedules.filter(
          schedule => schedule.schedule_date === date
        );

        const hasOverlap = dateSchedules.some(schedule => 
          checkTimeOverlap(startTime, endTime, schedule.start_time, schedule.end_time)
        );

        if (hasOverlap) {
          overlappingDates.push(date);
        }
      }

      if (overlappingDates.length > 0) {
        toast({
          title: t('gym.overlappingTimeSlots'),
          description: t('gym.timeSlotOverlapsWithExisting', { count: overlappingDates.length }),
          variant: "destructive",
        });
        return;
      }

      const repeatId = crypto.randomUUID();
      
      const slotsToInsert = futureDates.map(date => {
        const dateObj = new Date(date + 'T00:00:00');
        const jsDay = dateObj.getDay();
        const dayOfWeekForDate = (jsDay + 6) % 7;
        
        return {
          company_id: companyId,
          day_of_week: dayOfWeekForDate,
          start_time: startTime,
          end_time: endTime,
          max_capacity: capacity,
          schedule_date: date,
          is_active: true,
          created_by: userId,
          repeat_id: repeatId,
          repeat_type: repeatOption === "none" ? "daily" : repeatOption,
        };
      });

      // TODO: Insert slotsToInsert to Supabase database
      // Example: await supabase.from('schedules').insert(slotsToInsert);
      console.log('Slots to insert:', slotsToInsert);

      const message = futureDates.length === 1 
        ? t('gym.scheduleSlotAdded')
        : t('gym.recurringScheduleSlotsAdded', { count: futureDates.length });

      toast({
        title: t('gym.success'),
        description: message,
      });
      
      onScheduleAdded();
      setStartTime("09:00");
      setEndTime("10:00");
      setMaxCapacity("1");
      setRepeatOption("none");
      setOpen(false);
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error);
      toast({
        title: t('gym.error'),
        description: errorMsg,
        variant: "destructive",
      });
    } finally {
      setIsAddingSlot(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          {t('gym.addScheduleSlot')}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{t('gym.addScheduleSlot')}</DialogTitle>
          <DialogDescription>{t('gym.createTimeSlots')}</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 md:grid-cols-3 py-4">
          <div className="space-y-2">
            <Label>{t('gym.date')}</Label>
            <Input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>{t('gym.startTime')}</Label>
            <Input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>{t('gym.endTime')}</Label>
            <Input
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>{t('gym.capacity')}</Label>
            <Input
              type="number"
              min="1"
              value={maxCapacity}
              onChange={(e) => setMaxCapacity(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>{t('gym.repeat')}</Label>
            <Select value={repeatOption} onValueChange={setRepeatOption}>
              <SelectTrigger>
                <SelectValue placeholder={t('gym.noRepeat')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">{t('gym.noRepeat')}</SelectItem>
                <SelectItem value="daily">{t('gym.daily')}</SelectItem>
                <SelectItem value="weekdays">{t('gym.weekdays')}</SelectItem>
                <SelectItem value="weekly">{t('gym.weekly')}</SelectItem>
                <SelectItem value="monthly">{t('gym.monthly')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col justify-end">
            <Button 
              onClick={handleAddSlot} 
              className="w-full" 
              disabled={isAddingSlot}
            >
              {isAddingSlot ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  {t('gym.adding')}
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-2" />
                  {repeatOption !== "none" ? t('gym.addRecurringSlots') : t('gym.addSlot')}
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
