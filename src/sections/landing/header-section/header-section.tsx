'use client';

import Image from "next/image";

import { Button } from "@/components/ui/button";

import { LanguagePopover } from "@/components/language-popover";

import { Menu, X } from "lucide-react";

import useTranslate from "@/hook/use-translate";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

interface HeaderSectionProps {
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (mobileMenuOpen: boolean) => void;
  onShowAuth: () => void;
}

export const HeaderSection = ({ mobileMenuOpen, setMobileMenuOpen, onShowAuth }: HeaderSectionProps) => {

const handleShowAuth = (e: React.MouseEvent<HTMLButtonElement>) => {
  e.preventDefault();
  onShowAuth();
};

const router = useRouter();
const { isSignedIn } = useUser();
const { t } = useTranslate();

  return (
  <header className="border-b border-border bg-white sticky top-0 z-50">
    <div className="container mx-auto px-6 py-4">
      <div className="flex flex-row items-center justify-between gap-4">
        <Image src={'/exeltiqlogo.svg'} alt="Exeltiq logo" className="w-[140px]" width={140} height={140} />

        <div className="hidden md:flex items-center gap-4">
          <LanguagePopover/>
          <Button 
            variant={isSignedIn ? "default" : "ghost"} 
            suppressHydrationWarning 
            onClick={isSignedIn ? () => router.push("/dashboard") : handleShowAuth}
          >
            {isSignedIn ? t("dashboard.title") : t("landing.signIn")}
          </Button>
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>
      </div>
    </div>    
  </header>
  );
};