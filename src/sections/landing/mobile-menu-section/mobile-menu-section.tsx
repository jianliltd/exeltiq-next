import Link from "next/link";

import { Button } from "@/components/ui/button";

import useTranslate from "@/hook/use-translate";
import { useTranslation } from 'react-i18next';
import Image from "next/image";

interface MobileMenuSectionProps {
  setMobileMenuOpen: (mobileMenuOpen: boolean) => void;
}

export const MobileMenuSection = ({ setMobileMenuOpen }: MobileMenuSectionProps) => {
  const { i18n } = useTranslation();
  const { t } = useTranslate();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    localStorage.setItem('i18nextLng', lng);
    setMobileMenuOpen(false);
  };

  return (
    <>
    <div 
      className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 md:hidden animate-fade-in"
      onClick={() => setMobileMenuOpen(false)}
    />
    <div className="fixed top-[73px] left-0 right-0 bg-white border-b border-border shadow-lg z-50 md:hidden animate-slide-in-right">

      <div className="container mx-auto px-6 py-6 space-y-4">
        <div className="flex gap-2 mb-4" >
          <Button
            variant={i18n.language === "en" ? "default" : "outline"}
            size="sm"
            className="flex-1"
            onClick={() => changeLanguage("en")}
            
          >
            <span className="mr-2"><Image src="/flags/en.svg" alt="English" width={24} height={24} /></span> English
          </Button>
          <Button
            variant={i18n.language === "el" ? "default" : "outline"}
            size="sm"
            className="flex-1"
            onClick={() => changeLanguage("el")}
            
          >
            <span className="mr-2"><Image src="/flags/el.svg" alt="Greek" width={24} height={24} /></span> Ελληνικά
          </Button>
        </div>
        <Link href="#" className="block" >
          <Button 
            variant="ghost" 
            className="w-full justify-start text-lg h-12" 
            onClick={() => setMobileMenuOpen(false)}
            
          >
            {t("landing.signIn")}
          </Button>
        </Link>
        <Link href="#" className="block" >
          <Button 
            className="w-full text-lg h-12" 
            onClick={() => setMobileMenuOpen(false)}
            
          >
            {t("landing.startFreeTrial")}
          </Button>
        </Link>
      </div>
    </div>
  </>
  );
};