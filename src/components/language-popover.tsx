'use client';

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import useTranslate from "@/hook/use-translate";
import { useTranslation } from 'react-i18next';

const enFlag = "/flags/en.svg";
const elFlag = "/flags/el.svg";

export const LanguagePopover = () => {
  const { changeLanguage } = useTranslate();
  const { i18n } = useTranslation();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="cursor-pointer" >
          <Image 
            src={i18n.language === "en" ? enFlag : elFlag} 
            alt={i18n.language === "en" ? "English" : "Greek"} 
            className="size-7" 
            width={28}
            height={28}
            priority
            
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => changeLanguage("en")} className="flex items-center gap-2 cursor-pointer">
          <Image src={enFlag} alt="English" className="w-6 h-6" width={24} height={24} />
          <span className="mr-2">English</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => changeLanguage("el")} className="flex items-center gap-2 cursor-pointer">
          <Image src={elFlag} alt="Greek" className="w-6 h-6" width={24} height={24} />
          <span className="mr-2">Ελληνικά</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

