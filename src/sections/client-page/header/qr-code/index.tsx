'use client';

import { Button } from "@/components/ui/button";
import { QrCode as QrCodeIcon, ChevronUp, ChevronDown } from "lucide-react";
import useTranslate from "@/hook/use-translate";

interface QrCodeProps {
  company: {
    settings?: {
      check_in_qr_url?: string;
    };
  } | null;
  showQrCode: boolean;
  setShowQrCode: (show: boolean) => void;
  setShowPackages: (show: boolean) => void;
}

export const QrCode = ({ 
  company, 
  showQrCode, 
  setShowQrCode, 
  setShowPackages 
}: QrCodeProps) => {
  const { t } = useTranslate();

  return (
    <>
      {company?.settings?.check_in_qr_url && (
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => {
            setShowQrCode(!showQrCode);
            if (!showQrCode) setShowPackages(false);
          }}
          className="flex items-center gap-1.5"
        >
          <QrCodeIcon className="h-4 w-4" />
          <span className="hidden sm:inline">{t("gymBooking.qrCode")}</span>
          {showQrCode ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
        </Button>
      )}
    </>
  );
};
