'use client';

import { Button } from "@/components/ui/button";
import { ShoppingCart, ChevronUp, ChevronDown } from "lucide-react";
import useTranslate from "@/hook/use-translate";

interface Package {
  id: string;
  title: string;
  price: number;
  session_count: number;
}

interface PackagesProps {
  packages: Package[];
  showPackages: boolean;
  setShowPackages: (show: boolean) => void;
  setShowQrCode: (show: boolean) => void;
}

export const Packages = ({ 
  packages, 
  showPackages, 
  setShowPackages, 
  setShowQrCode 
}: PackagesProps) => {
  const { t } = useTranslate();

  return (
    <>
      {packages.length > 0 && (
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => {
            setShowPackages(!showPackages);
            if (!showPackages) setShowQrCode(false);
          }}
          className="flex items-center gap-1.5"
        >
          <ShoppingCart className="h-4 w-4" />
          <span className="hidden sm:inline">{t("gymBooking.buyPackages")}</span>
          {showPackages ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
        </Button>
      )}
    </>
  );
};