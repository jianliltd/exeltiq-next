import useTranslate from "@/hook/use-translate";
import { AddScheduleSlotDialog } from "./add-schedule-dialog";

interface ScheduleHeaderProps {
  companyId: string;
  userId: string | null;
  schedules: Array<{
    schedule_date: string | null;
    start_time: string;
    end_time: string;
  }>;
  onScheduleAdded: () => void;
}

export const ScheduleHeader = ({ companyId, userId, schedules, onScheduleAdded }: ScheduleHeaderProps) => {
  const { t } = useTranslate();
  
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold">{t('gym.schedule')}</h2>
        <p className="text-muted-foreground mt-1 text-sm sm:text-base">{t('gym.manageTrainingSessions')}</p>
      </div>
      <AddScheduleSlotDialog
        companyId={companyId}
        userId={userId}
        schedules={schedules}
        onScheduleAdded={onScheduleAdded}
      />
    </div>
  );
};

