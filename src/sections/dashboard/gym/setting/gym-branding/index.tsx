"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ImageIcon } from "lucide-react";
import { Upload } from "lucide-react";
import { Download } from "lucide-react";
import useTranslate from "@/hook/use-translate";
import { useTranslation } from "react-i18next";
import { useRef, useState } from "react";
import { useToast } from "@/hook/use-toast";
import Image from "next/image";


export const GymBranding = () => {
  const { t } = useTranslate();
  const { i18n } = useTranslation();
  const { toast } = useToast();
  const [gymName, setGymName] = useState("Test Gym");
  const [logoUrl, setLogoUrl] = useState("/exeltiqlogo.svg");
  const [checkInText, setCheckInText] = useState("Test Check-in Text");
  const [checkInQrUrl, setCheckInQrUrl] = useState("/default-qr.png");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSaveGymName = () => {
    setSaving(true);
  };
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUploading(true);
    const file = e.target.files?.[0];
    if (file) {
      setLogoUrl(URL.createObjectURL(file));
    }
  };
  const handleSaveCheckInQR = () => {
    setSaving(true);
  };
  const handleDownloadCheckInQR = () => {
    setSaving(true);
  };
  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>{t('gym.gymBrandingTitle')}</CardTitle>
          <CardDescription>{t('gym.customizeBrandingDesc')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="gymName">{t('gym.gymNameLabel')}</Label>
            <div className="flex flex-col sm:flex-row gap-2">
              <Input
                id="gymName"
                placeholder={t('gym.yourGymName')}
                value={gymName}
                onChange={(e) => setGymName(e.target.value)}
                className="flex-1"
              />
              <Button onClick={handleSaveGymName} disabled={saving} className="sm:w-auto">
                {saving ? t('gym.saving') : t('common.save')}
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label>{t('gym.gymLogoLabel')}</Label>
            <div className="flex flex-col sm:flex-row gap-4 sm:items-center">
              {logoUrl ?
              (
                <Image src={logoUrl} className="w-32 h-32 sm:w-48 sm:h-48 border rounded-sm p-2 mx-auto sm:mx-0" alt="Gym Logo" width={128} height={128}/>  
              ):
              (
                <div className="w-32 h-32 sm:w-48 sm:h-48 border rounded-lg bg-muted flex items-center justify-center mx-auto sm:mx-0">
                  <ImageIcon className="h-8 w-8 text-muted-foreground" />
                </div>
              )}
              <div className="flex-1 space-y-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="hidden"
                />
                <Button
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="w-full sm:w-auto"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  {uploading ? t('gym.uploading') : t('gym.uploadLogoBtn')}
                </Button>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="checkInText">{t('gym.checkInQrLabel')}</Label>
              <p className="text-sm text-muted-foreground mb-3">
                {t('gym.checkInQrDesc')}
              </p>
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-2">
                  <Input
                    id="checkInText"
                    value={checkInText}
                    onChange={(e) => setCheckInText(e.target.value)}
                    placeholder={t('gym.enterCheckInTextPlaceholder')}
                    className="flex-1"
                  />
                  <Button onClick={handleSaveCheckInQR} disabled={uploading || !checkInText.trim()} className="sm:w-auto whitespace-nowrap">
                    {uploading ? t('gym.saving') : <><span className="hidden sm:inline">{t('gym.generateAndSave')}</span><span className="sm:hidden">{t('gym.generate')}</span></>}
                  </Button>
                </div>
                
                {checkInQrUrl && (
                  <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row gap-4 sm:items-start">
                      <div className="border rounded-sm bg-white mx-auto sm:mx-0">
                        <Image
                          src="/default-qr.png"
                          alt="Check-in QR Code"
                          className="w-32 h-32 sm:w-48 sm:h-48"
                          width={128}
                          height={128}
                        />
                      </div>
                      <div className="space-y-2 flex-1">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleDownloadCheckInQR}
                          className="w-full sm:w-auto"
                        >
                          <Download className="h-4 w-4 mr-2" />
                          {t('gym.downloadQrCodeBtn')}
                        </Button>
                        {checkInText && (
                          <div className="p-3 bg-muted rounded-lg">
                            <p className="text-xs font-medium text-muted-foreground mb-1">{t('gym.qrContentLabel')}</p>
                            <p className="text-sm break-all">{checkInText}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};