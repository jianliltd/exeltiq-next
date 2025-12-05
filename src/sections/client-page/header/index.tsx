'use client';

import { useState } from "react";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Ticket, Loader2 } from "lucide-react";
import { CompanyInfo } from "./company-info";
import { Packages } from "./packages";
import { QrCode } from "./qr-code";
import { LogoutButton } from "./logout-button";
import { LanguagePopover } from "@/components/language-popover";
import useTranslate from "@/hook/use-translate";

interface Package {
  id: string;
  title: string;
  price: number;
  session_count: number;
  description?: string;
}

interface Company {
  settings?: {
    check_in_qr_url?: string;
  };
}

interface ClientData {
  name: string;
  sessions_remaining?: number;
}

export const Header = () => {
  const { t } = useTranslate();
  const [showPackages, setShowPackages] = useState(false);
  const [showQrCode, setShowQrCode] = useState(false);
  const [purchasingPackageId, setPurchasingPackageId] = useState<string | null>(null);
  
  // Mock data for testing
  const [packages] = useState<Package[]>([
    {
      id: "1",
      title: "Monthly Pass",
      price: 49.99,
      session_count: 20,
      description: "Perfect for regular gym-goers"
    },
    {
      id: "2",
      title: "Weekly Pass",
      price: 15.99,
      session_count: 5,
      description: "Great for beginners"
    },
    {
      id: "3",
      title: "Single Session",
      price: 4.99,
      session_count: 1,
      description: "Try before you commit"
    }
  ]);
  
  const [company] = useState<Company | null>({
    settings: {
      check_in_qr_url: "/default-qr.png"
    }
  });
  
  const [clientData] = useState<ClientData | null>({
    name: "John Doe",
    sessions_remaining: 8
  });

  const handleLogout = () => {
    // TODO: Implement logout logic
    console.log("Logging out...");
  };

  const handlePurchasePackage = async (packageId: string) => {
    setPurchasingPackageId(packageId);
    // Simulate purchase
    setTimeout(() => {
      console.log("Purchasing package:", packageId);
      setPurchasingPackageId(null);
    }, 1500);
  };

  return (
    <Card>
      <CardHeader className="pb-3 pt-4">
        <div className="flex items-start justify-between gap-4">
          <CompanyInfo />
          <div className="flex items-center gap-2">
            <LanguagePopover />
            <Packages 
              packages={packages}
              showPackages={showPackages}
              setShowPackages={setShowPackages}
              setShowQrCode={setShowQrCode}
            />
            <QrCode 
              company={company}
              showQrCode={showQrCode}
              setShowQrCode={setShowQrCode}
              setShowPackages={setShowPackages}
            />
            <LogoutButton 
              clientData={clientData}
              handleLogout={handleLogout}
            />
          </div>
        </div>
      </CardHeader>

      {/* Collapsible Packages */}
      {packages.length > 0 && showPackages && (
        <CardContent className="pt-4 border-t">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5 text-primary" />
              <h3 className="font-semibold">{t("gymBooking.buyPackages")}</h3>
            </div>
            <Badge variant="outline" className="gap-1">
              <Ticket className="h-3 w-3" />
              {clientData?.sessions_remaining || 0} {t("gymBooking.sessionsLeft")}
            </Badge>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {packages.map((pkg) => (
              <Card key={pkg.id} className="relative overflow-hidden">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">{pkg.title}</CardTitle>
                  {pkg.description && (
                    <CardDescription className="text-xs line-clamp-2">
                      {pkg.description}
                    </CardDescription>
                  )}
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-bold">€{pkg.price}</span>
                    <span className="text-xs text-muted-foreground">
                      {t("gymBooking.forSessions")} {pkg.session_count} {t("gymBooking.sessions")}
                    </span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    €{(pkg.price / pkg.session_count).toFixed(2)} {t("gymBooking.perSession")}
                  </div>
                  <Button
                    className="w-full"
                    disabled={purchasingPackageId === pkg.id}
                    onClick={() => handlePurchasePackage(pkg.id)}
                  >
                    {purchasingPackageId === pkg.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <>
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        {t("gymBooking.purchase")}
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      )}
      
      {/* Collapsible QR Code */}
      {company?.settings?.check_in_qr_url && showQrCode && (
        <CardContent className="pt-4 border-t flex justify-center">
          <div className="border border-primary/10 rounded-lg overflow-hidden bg-white">
            <img
              src={company.settings.check_in_qr_url}
              alt="Check-in QR Code"
              className="w-32 h-32 sm:w-40 sm:h-40"
            />
          </div>
        </CardContent>
      )}
    </Card>
  );
};