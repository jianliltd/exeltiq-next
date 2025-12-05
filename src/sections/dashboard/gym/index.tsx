"use client";

import { useEffect, useState } from 'react';

import { Tabs, TabsTrigger, TabsList, TabsContent } from "@/components/ui/tabs";

import { GymOnboard } from './gym-onboard';

import { Overview } from './overview';
import { Schedule } from './schedule';
import { Clients } from './clients';
import { Setting } from './setting';

import { GYM_TABS } from './mock';

import useTranslate from "@/hook/use-translate";
import { useSupabase } from '@/hooks/use-supabase';
import { useUser } from '@clerk/nextjs';
import { User } from '@clerk/nextjs/server';

export const GymView = () => {
  const [hasCompany, setHasCompany] = useState(false)
  const { t } = useTranslate();

  const { user } = useUser()

  const supabase = useSupabase()

  // Check if user has a company (via user_roles table)
  const checkHasCompany = async () => {
    if (!user?.id) return;
    
    const { data, error } = await supabase
      .from("companies")
      .select("*")
      .single();

    if (data && !error) {
      setHasCompany(true);
    }
  }

  useEffect(() => {
    checkHasCompany()
  }, [user?.id])

  return (
    <>
      {!hasCompany && user && (
        <GymOnboard/>
      )}
      {hasCompany && 
        <Tabs defaultValue="overview">
          <TabsList className="grid w-full grid-cols-4 mb-6">
            {GYM_TABS.map((tab) => (
              <TabsTrigger 
                key={tab.value} 
                value={tab.value} 
                className="flex items-center gap-1 sm:gap-2"
              >
                <tab.icon className="h-4 w-4" />
                <span className="hidden sm:inline">{t(tab.labelKey)}</span>
              </TabsTrigger>
            ))} 
          </TabsList>
          <TabsContent value="overview">
            <Overview />
          </TabsContent>
          <TabsContent value="schedule">
            <Schedule />
          </TabsContent>
          <TabsContent value="clients">
            <Clients />
          </TabsContent>
          <TabsContent value="settings">
            <Setting />
          </TabsContent>
        </Tabs>
      }
    </>
  );
};
