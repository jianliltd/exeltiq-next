'use client';

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Calendar, Loader2 } from "lucide-react";
import { format } from "date-fns";
import useTranslate from "@/hook/use-translate";

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

interface SessionsStateProps {
  myBookings: Booking[];
  myWaitlist: Waitlist[];
  activeMySessionsTab: "bookings" | "waitlist";
  setActiveMySessionsTab: (tab: "bookings" | "waitlist") => void;
  isCancelBooking: {
    loading: boolean;
    key: string | null;
  };
  isCancelingWaitlist: {
    loading: boolean;
    key: string | null;
  };
  handleCancelBooking: (id: string) => void;
  handleCancelWaitlist: (id: string) => void;
  canGetRefund: (date: string, time: string) => boolean;
  loading: boolean;
  key: string | null;
}

export const SessionsState = ({
  myBookings,
  myWaitlist,
  activeMySessionsTab,
  setActiveMySessionsTab,
  isCancelBooking,
  isCancelingWaitlist,
  handleCancelBooking,
  handleCancelWaitlist,
  canGetRefund,
  loading,
}: SessionsStateProps) => {
  const { t } = useTranslate();

  return (
    <>
      {(myBookings.length >= 0 || myWaitlist.length >= 0) && (
        <Card>
          <CardHeader className="flex flex-row gap-2 items-center pb-3 pt-4">
            <CardTitle className="text-lg">{t("gymBooking.mySessions")}</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <Tabs value={activeMySessionsTab} onValueChange={(value) => setActiveMySessionsTab(value as "bookings" | "waitlist")}>
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="bookings" className="relative">
                  {t("gymBooking.upcomingSessions")}
                  {myBookings.length > 0 && (
                    <Badge className="ml-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                      {myBookings.length}
                    </Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger value="waitlist" className="relative">
                  {t("gymBooking.waitingList")}
                  {myWaitlist.length > 0 && (
                    <Badge className="ml-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-orange-500">
                      {myWaitlist.length}
                    </Badge>
                  )}
                </TabsTrigger>
              </TabsList>

              <TabsContent value="bookings" className="mt-0">
                {myBookings.length > 0 ? (
                  <div className="space-y-1.5">
                    {myBookings.map((booking) => {
                      const willRefund = canGetRefund(booking.schedule_date, booking.start_time);
                      return (
                        <div key={booking.id} className="flex items-center justify-between p-2 border rounded-md">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                            <div>
                              <p className="text-sm font-medium">
                                {booking.schedule_date}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {booking.start_time} - {booking.end_time}
                              </p>
                            </div>
                          </div>
                          <Button
                            variant="destructive"
                            size="sm"
                            disabled={isCancelBooking.loading}
                            onClick={() => handleCancelBooking(booking.id)}
                            className="min-w-32 text-xs h-8"
                          >
                            {(isCancelBooking.key === booking.id && isCancelBooking.loading) ? (
                              <Loader2 className="h-3 w-3 animate-spin" />
                            ) : willRefund ? t("gymBooking.cancelWithRefund") : t("gymBooking.cancelWithoutRefund")}
                          </Button>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-6 text-muted-foreground">
                    <p className="text-sm">{t("gymBooking.noUpcomingSessions")}</p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="waitlist" className="mt-0">
                {myWaitlist.length > 0 ? (
                  <div className="space-y-1.5">
                    <p className="text-xs text-muted-foreground mb-2">{t("gymBooking.waitingListAutoBook")}</p>
                    {myWaitlist.map((waitlist) => (
                      <div key={waitlist.id} className="flex items-center justify-between p-2 border rounded-md bg-orange-50 dark:bg-orange-950/20">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-orange-600 flex-shrink-0" />
                          <div>
                            <p className="text-sm font-medium">
                              {format(new Date(waitlist.schedule_date + 'T' + waitlist.start_time), "EEEE, MMMM d")}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {waitlist.start_time.substring(0, 5)} - {waitlist.end_time.substring(0, 5)}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className="bg-orange-100 hover:bg-orange-200 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400 text-xs">
                            {t("gymBooking.position")}: {waitlist.position}
                          </Badge>
                          <Button
                            size="sm"
                            disabled={isCancelingWaitlist.loading}
                            onClick={() => handleCancelWaitlist(waitlist.id)}
                            className="min-w-20 h-8 text-xs bg-orange-500 hover:bg-orange-600 text-white border-orange-500"
                          >
                            {(isCancelingWaitlist.key === waitlist.id && isCancelingWaitlist.loading) ? (
                              <Loader2 className="h-3 w-3 animate-spin" />
                            ) : t("gymBooking.leave")}
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 text-muted-foreground">
                    <p className="text-sm">{t("gymBooking.notOnWaitingLists")}</p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}
    </>
  );
};
