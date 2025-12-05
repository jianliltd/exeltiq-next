'use client';

import { CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronLeft, ChevronRight, Ticket, CalendarDays, CalendarRange, Calendar } from "lucide-react";
import useTranslate from "@/hook/use-translate";

interface BookingHeaderProps {
  viewMode: "day" | "week" | "month";
  setViewMode: (mode: "day" | "week" | "month") => void;
  currentDay: Date;
  currentWeekMonday: Date;
  currentMonth: Date;
  goToPreviousDay: () => void;
  goToNextDay: () => void;
  goToPreviousWeek: () => void;
  goToNextWeek: () => void;
  goToPreviousMonth: () => void;
  goToNextMonth: () => void;
  formatDay: (date: Date) => string;
  formatWeekRange: (date: Date) => string;
  formatMonthYear: (date: Date) => string;
  clientData?: {
    sessions_remaining?: number;
  };
}

export const BookingHeader = ({
  viewMode,
  setViewMode,
  currentDay,
  currentWeekMonday,
  currentMonth,
  goToPreviousDay,
  goToNextDay,
  goToPreviousWeek,
  goToNextWeek,
  goToPreviousMonth,
  goToNextMonth,
  formatDay,
  formatWeekRange,
  formatMonthYear,
  clientData,
}: BookingHeaderProps) => {
  const { t } = useTranslate();

  return (
    <CardHeader className="pb-3 pt-4">
      <div className="flex md:flex-row flex-col gap-3 justify-between items-center">
        {/* Navigation */}
        <div className="flex items-center justify-between gap-3 w-full md:w-auto">
          <Button
            variant="outline"
            size="sm"
            className="flex-none h-8 w-8 p-0"
            onClick={
              viewMode === "day" ? goToPreviousDay :
              viewMode === "week" ? goToPreviousWeek : 
              goToPreviousMonth
            }
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          
          <div className="flex flex-col items-center">
            <CardTitle className="text-center text-sm sm:text-base">
              {viewMode === "day"
                ? formatDay(currentDay)
                : viewMode === "week" 
                ? formatWeekRange(currentWeekMonday) 
                : formatMonthYear(currentMonth)}
            </CardTitle>
          </div>
          
          <Button
            variant="outline"
            size="sm"
            className="flex-none h-8 w-8 p-0"
            onClick={
              viewMode === "day" ? goToNextDay :
              viewMode === "week" ? goToNextWeek : 
              goToNextMonth
            }
          >
            <ChevronRight className="h-4 w-4" />
          </Button>

          <Badge variant="outline" className="gap-1 ml-2">
            <Ticket className="h-3 w-3" />
            {clientData?.sessions_remaining || 0} {t("gymBooking.sessionsLeft")}
          </Badge>
        </div>
        {/* View Mode Toggle */}
        <div className="flex items-center justify-center">
          <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as "day" | "week" | "month")}>
            <TabsList className="h-9">
              <TabsTrigger value="day" className="flex items-center gap-1.5 text-xs">
                <CalendarDays className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">{t("gymBooking.day")}</span>
              </TabsTrigger>
              <TabsTrigger value="week" className="flex items-center gap-1.5 text-xs">
                <CalendarRange className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">{t("gymBooking.week")}</span>
              </TabsTrigger>
              <TabsTrigger value="month" className="flex items-center gap-1.5 text-xs">
                <Calendar className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">{t("gymBooking.month")}</span>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>
    </CardHeader>
  );
};