'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import useTranslate from "@/hook/use-translate";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { useToast } from "@/hook/use-toast";

export const GymSetting = () => {
  const { t } = useTranslate();
  const { i18n } = useTranslation();
  const { toast } = useToast();
  const [gymSlug, setGymSlug] = useState("test-slug");
  const [publicBookingUrl, setPublicBookingUrl] = useState("https://exeltiq.com/gym/test-slug");

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>{t('gym.gymSettingsTitle')}</CardTitle>
          <CardDescription>{t('gym.manageBookingPageDesc')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="currentSlug">{t('gym.currentGymSlug')}</Label>
            <Input id="currentSlug" value={gymSlug} disabled />
          </div>
          <div className="space-y-2">
            <Label>{t('gym.publicBookingUrl')}</Label>
            <div className="flex gap-2">
              <Input value={publicBookingUrl} readOnly />
              <Button
                variant="outline"
                onClick={() => {
                  navigator.clipboard.writeText(publicBookingUrl);
                  toast({
                    title: t('gym.copied'),
                    description: t('gym.bookingUrlCopiedDesc'),
                  });
                }}
              >
                {t('gym.copy')}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};