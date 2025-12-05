import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Mail, Phone, Instagram, Facebook, MapPin, Share2 } from "lucide-react";
import useTranslate from "@/hook/use-translate";
import { useTranslation } from "react-i18next";
import { useToast } from "@/hook/use-toast";
import { useState } from "react";


export const ContactInfo = () => {
  const { t } = useTranslate();
  const { i18n } = useTranslation();
  const { toast } = useToast();
  const [contactInfo, setContactInfo] = useState({
    email: "",
    phone: "",
    instagram_url: "",
    facebook_url: "",
    google_maps_url: "",
  });
  const [saving, setSaving] = useState(false);
  const handleSaveContactInfo = () => {
    setSaving(true);
  };
  const handleShare = (type: string, value: string) => {
    navigator.clipboard.writeText(value);
    toast({
      title: t('gym.copied'),
      description: t('gym.contactInfoCopiedDesc'),
    });
  };
  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>{t('gym.contactInfoTitle')}</CardTitle>
          <CardDescription>{t('gym.contactInfoDesc')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              {t('gym.email')}
            </Label>
            <div className="flex gap-2">
              <Input
                id="email"
                type="email"
                placeholder={t('gym.emailPlaceholderGym')}
                value={contactInfo.email}
                onChange={(e) => setContactInfo({ ...contactInfo, email: e.target.value })}
                className="flex-1"
              />
              {contactInfo.email && (
                <Button
                  variant="outline"
                  size="icon"
                  className="shrink-0"
                  onClick={() => handleShare("email", contactInfo.email)}
                >
                  <Share2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone" className="flex items-center gap-2">
              <Phone className="h-4 w-4" />
              {t('gym.phone')}
            </Label>
            <div className="flex gap-2">
              <Input
                id="phone"
                type="tel"
                placeholder={t('gym.phonePlaceholderContact')}
                value={contactInfo.phone}
                onChange={(e) => setContactInfo({ ...contactInfo, phone: e.target.value })}
                className="flex-1"
              />
              {contactInfo.phone && (
                <Button
                  variant="outline"
                  size="icon"
                  className="shrink-0"
                  onClick={() => handleShare("phone", contactInfo.phone)}
                >
                  <Share2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="instagram" className="flex items-center gap-2">
              <Instagram className="h-4 w-4" />
              {t('gym.instagram')}
            </Label>
            <div className="flex gap-2">
              <Input
                id="instagram"
                placeholder={t('gym.instagramPlaceholder')}
                value={contactInfo.instagram_url}
                onChange={(e) => setContactInfo({ ...contactInfo, instagram_url: e.target.value })}
                className="flex-1"
              />
              {contactInfo.instagram_url && (
                <Button
                  variant="outline"
                  size="icon"
                  className="shrink-0"
                  onClick={() => handleShare("instagram", contactInfo.instagram_url)}
                >
                  <Share2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="facebook" className="flex items-center gap-2">
              <Facebook className="h-4 w-4" />
              {t('gym.facebook')}
            </Label>
            <div className="flex gap-2">
              <Input
                id="facebook"
                placeholder={t('gym.facebookPlaceholder')}
                value={contactInfo.facebook_url}
                onChange={(e) => setContactInfo({ ...contactInfo, facebook_url: e.target.value })}
                className="flex-1"
              />
              {contactInfo.facebook_url && (
                <Button
                  variant="outline"
                  size="icon"
                  className="shrink-0"
                  onClick={() => handleShare("facebook", contactInfo.facebook_url)}
                >
                  <Share2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="maps" className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              {t('gym.googleMapsLabel')}
            </Label>
            <div className="flex gap-2">
              <Input
                id="maps"
                placeholder={t('gym.googleMapsPlaceholder')}
                value={contactInfo.google_maps_url}
                onChange={(e) => setContactInfo({ ...contactInfo, google_maps_url: e.target.value })}
                className="flex-1"
              />
              {contactInfo.google_maps_url && (
                <Button
                  variant="outline"
                  size="icon"
                  className="shrink-0"
                  onClick={() => handleShare("maps", contactInfo.google_maps_url)}
                >
                  <Share2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>

          <Button onClick={handleSaveContactInfo} disabled={saving} className="w-full">
            {saving ? t('gym.saving') : t('gym.saveContactInfoBtn')}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};