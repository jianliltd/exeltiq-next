'use client';

import { Button } from "@/components/ui/button";
import { User, LogOut } from "lucide-react";
import useTranslate from "@/hook/use-translate";

interface LogoutButtonProps {
  clientData: {
    name: string;
  } | null;
  handleLogout: () => void;
}

export const LogoutButton = ({ clientData, handleLogout }: LogoutButtonProps) => {
  const { t } = useTranslate();

  return (
    <div className="flex items-center gap-1.5 px-2 py-1 border rounded-md bg-background">
      <User className="h-4 w-4 text-muted-foreground" />
      <span className="text-sm font-medium">{clientData?.name}</span>
      <Button 
        variant="ghost" 
        size="sm"
        onClick={handleLogout}
        title={t("gymBooking.logout")}
        className="h-6 w-6 p-0 hover:bg-destructive/10"
      >
        <LogOut className="h-4 w-4" />
      </Button>
    </div>
  );
};
