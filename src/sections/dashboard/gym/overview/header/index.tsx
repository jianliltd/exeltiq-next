import { useCallback, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CardHeader } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, CalendarDays, CalendarRange, ChevronLeft, ChevronRight } from "lucide-react";
import useTranslate from "@/hook/use-translate";
import { useTranslation } from "react-i18next";
import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth, addDays, addWeeks, addMonths, startOfDay, endOfDay } from "date-fns";
import { el } from "date-fns/locale";
import { TabMode, TodaySession, ViewMode, WaitlistEntry } from "../../type";

interface OverviewHeaderProps {
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  tabMode: TabMode;
  setTabMode: (mode: TabMode) => void;
  currentDate: Date;
  setCurrentDate: (date: Date | ((prev: Date) => Date)) => void;
  allSessions: TodaySession[];
  waitlist: WaitlistEntry[];
}

export const OverviewHeader = ({ 
  viewMode, 
  setViewMode, 
  tabMode, 
  setTabMode, 
  currentDate, 
  setCurrentDate, 
  allSessions, 
  waitlist 
}: OverviewHeaderProps) => {
  const { t } = useTranslate();
  const { i18n } = useTranslation();

  const tabs = [
    {
      label: t('gym.bookings'),
      value: "bookings",
    },
    {
      label: t('gym.waitingList'),
      value: "waitlist",
    },
  ];

  const navigateDate = (direction: "prev" | "next") => {
    setCurrentDate((prevDate) => {
      switch (viewMode) {
        case "day":
          return direction === "prev" ? addDays(prevDate, -1) : addDays(prevDate, 1);
        case "week":
          return direction === "prev" ? addWeeks(prevDate, -1) : addWeeks(prevDate, 1);
        case "month":
          return direction === "prev" ? addMonths(prevDate, -1) : addMonths(prevDate, 1);
        default:
          return prevDate;
      }
    });
  };

  const getDateRangeLabel = () => {
    const locale = i18n.language === 'el' ? el : undefined;
    switch (viewMode) {
      case "day":
        return format(currentDate, "EEEE, MMMM d, yyyy", { locale });
      case "week": {
        const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
        const weekEnd = endOfWeek(currentDate, { weekStartsOn: 1 });
        return `${format(weekStart, "MMM d", { locale })} - ${format(weekEnd, "d, yyyy", { locale })}`;
      }
      case "month":
        return format(currentDate, "MMMM yyyy", { locale });
      default:
        return format(currentDate, "MMMM d, yyyy", { locale });
    }
  };

  const getDateRange = useCallback(() => {
    let startDate: Date;
    let endDate: Date;

    switch (viewMode) {
      case "day":
        startDate = startOfDay(currentDate);
        endDate = endOfDay(currentDate);
        break;
      case "week":
        startDate = startOfWeek(currentDate, { weekStartsOn: 1 });
        endDate = endOfWeek(currentDate, { weekStartsOn: 1 });
        break;
      case "month":
        startDate = startOfMonth(currentDate);
        endDate = endOfMonth(currentDate);
        break;
      default:
        startDate = startOfDay(currentDate);
        endDate = endOfDay(currentDate);
    }

    return {
      startDate: format(startDate, "yyyy-MM-dd"),
      endDate: format(endDate, "yyyy-MM-dd"),
    };
  }, [viewMode, currentDate]);

  const sessions = useMemo(() => {
    const { startDate, endDate } = getDateRange();
    return allSessions.filter((session) => {
      return session.schedule_date >= startDate && session.schedule_date <= endDate;
    });
  }, [allSessions, getDateRange]);

  return (
    <CardHeader className="space-y-4">
      <div className="flex items-center justify-center">
        <Tabs value={tabMode} onValueChange={(value) => setTabMode(value as TabMode)} className="w-full max-w-md">
          <TabsList className="grid w-full grid-cols-2">
            {tabs.map((tab) => (
              <TabsTrigger key={tab.value} value={tab.value} className="text-sm sm:text-base">
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>
      
      <div className="flex flex-col lg:flex-row items-center justify-between gap-4 w-full">
        <div className="flex items-center gap-2 flex-wrap justify-center lg:justify-start">
          <Button 
            variant="outline" 
            size="icon" 
            className="h-10 w-10 shrink-0 rounded-lg"
            onClick={() => navigateDate("prev")}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          
          <div className="flex items-center px-2">
            <span className="text-base md:text-lg font-semibold whitespace-nowrap">
              {getDateRangeLabel()}
            </span>
          </div>
          
          <Button 
            variant="outline" 
            size="icon"
            className="h-10 w-10 shrink-0 rounded-lg"
            onClick={() => navigateDate("next")}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          
          <Badge variant="default" className="ml-2 px-3 py-1.5 text-sm font-medium rounded-full">
            {tabMode === "bookings" ? (
              <>{sessions.length} {sessions.length === 1 ? t('gym.session') : t('gym.sessions')}</>
            ) : (
              <>{waitlist.length} {waitlist.length === 1 ? t('gym.entry') : t('gym.entries')}</>
            )}
          </Badge>
        </div>

        <div className="flex items-center justify-center lg:justify-end">
          <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as ViewMode)}>
            <TabsList className="grid grid-cols-3">
              <TabsTrigger value="day" className="flex items-center justify-center gap-1.5 text-xs sm:text-sm px-3">
                <CalendarDays className="h-4 w-4" />
                <span>{t('gym.day')}</span>
              </TabsTrigger>
              <TabsTrigger value="week" className="flex items-center justify-center gap-1.5 text-xs sm:text-sm px-3">
                <CalendarRange className="h-4 w-4" />
                <span>{t('gym.week')}</span>
              </TabsTrigger>
              <TabsTrigger value="month" className="flex items-center justify-center gap-1.5 text-xs sm:text-sm px-3">
                <Calendar className="h-4 w-4" />
                <span>{t('gym.month')}</span>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>
    </CardHeader>
  );
};