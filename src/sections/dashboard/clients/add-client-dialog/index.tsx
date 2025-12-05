import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

import { useToast } from "@/hook/use-toast";

import { useTranslation } from "react-i18next";


interface AddClientDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function AddClientDialog({ open, onOpenChange }: AddClientDialogProps) {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company_name: "",
    address: "",
    city: "",
    country: "",
    budget: "",
    allergies: "",
    preferences: "",
    notes: ""
  });

  const handleAddClient = async () => {
    console.log(formData);
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast({
        title: t("addClient.nameRequiredTitle"),
        description: t("addClient.nameRequiredDescription"),
        variant: "destructive",
      });
      return;
    }
    handleAddClient();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{t("addClient.title")}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">{t("addClient.nameRequired")}</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="company_name">{t("addClient.companyNameLabel")}</Label>
              <Input
                id="company_name"
                value={formData.company_name}
                onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="email">{t("addClient.emailLabel")}</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="phone">{t("addClient.phoneLabel")}</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="address">{t("addClient.addressLabel")}</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="city">{t("addClient.cityLabel")}</Label>
              <Input
                id="city"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="country">{t("addClient.countryLabel")}</Label>
              <Input
                id="country"
                value={formData.country}
                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="budget">{t("addClient.budgetLabel")}</Label>
            <Input
              id="budget"
              value={formData.budget}
              onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
              placeholder={t("addClient.budgetPlaceholder")}
            />
          </div>

          <div>
            <Label htmlFor="allergies">{t("addClient.allergiesLabel")}</Label>
            <Textarea
              id="allergies"
              value={formData.allergies}
              onChange={(e) => setFormData({ ...formData, allergies: e.target.value })}
              placeholder={t("addClient.allergiesPlaceholder")}
              rows={2}
            />
          </div>

          <div>
            <Label htmlFor="preferences">{t("addClient.preferencesLabel")}</Label>
            <Textarea
              id="preferences"
              value={formData.preferences}
              onChange={(e) => setFormData({ ...formData, preferences: e.target.value })}
              placeholder={t("addClient.preferencesPlaceholder")}
              rows={2}
            />
          </div>

          <div>
            <Label htmlFor="notes">{t("addClient.notesLabel")}</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder={t("addClient.notesPlaceholder")}
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              {t("addClient.cancelButton")}
            </Button>
            <Button type="submit">
              {t("addClient.addButton")}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
