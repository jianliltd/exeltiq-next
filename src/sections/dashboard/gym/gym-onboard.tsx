import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

import { Dumbbell } from "lucide-react";

import useTranslate from "@/hook/use-translate";
import { useForm, useWatch } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

export const phoneRegExp =/^((\+[1-9]{1,4}[ \-]*)|(\([0-9]{2,3}\)[ \-]*)|([0-9]{2,4})[ \-]*)*?[0-9]{3,4}?[ \-]*[0-9]{3,4}?$/;

const gymOnboardSchema = yup.object({
  companyName: yup.string().required("validation.gymOnboard.companyNameRequired"),
  gymSlug: yup
    .string()
    .required("validation.gymOnboard.gymSlugRequired")
    .matches(/^[a-z0-9-]+$/, "validation.gymOnboard.gymSlugFormat"),
  contactEmail: yup
    .string()
    .required("validation.gymOnboard.contactEmailRequired")
    .email("validation.gymOnboard.invalidEmail"),
  contactPhone: yup.string().required("validation.gymOnboard.contactPhoneRequired").matches(phoneRegExp, "validation.gymOnboard.invalidPhone"),
});

type GymOnboardFormData = yup.InferType<typeof gymOnboardSchema>;

export const GymOnboard = () => {
  const { t } = useTranslate();
  
  const { register, handleSubmit, control, formState: { errors, isSubmitting } } = useForm<GymOnboardFormData>({
    resolver: yupResolver(gymOnboardSchema),
    defaultValues: {
      companyName: "",
      gymSlug: "",
      contactEmail: "",
      contactPhone: "",
    },
  });

  const gymSlug = useWatch({ control, name: "gymSlug" });

  const onSubmit = async (data: GymOnboardFormData) => {
    console.log("Form submitted:", data);
    // TODO: Implement form submission logic
  };

  return (
    <div className="flex justify-center p-4">
      <Card className="w-full max-w-4xl">
        <CardHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-primary/10 rounded-full">
              <Dumbbell className="h-6 w-6 text-primary" />
            </div>
            <div>
              <CardTitle>{t("gym.enableGymFeatures")}</CardTitle>
              <CardDescription>
                {t("gym.setupMessage")}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Company Name */}
            <div className="flex flex-col gap-2.5">
              <Label htmlFor="companyName">
                {t("gym.companyName")}
              </Label>
              <Input
                id="companyName"
                placeholder={t("gym.yourCompanyName")}
                error={errors.companyName ? t(errors.companyName.message!) : undefined}
                {...register("companyName")}
              />
            </div>

            {/* Gym Page Slug */}
            <div className="flex flex-col gap-2.5">
              <Label htmlFor="gymSlug">
                {t("gym.gymPageSlug")}
              </Label>
              <Input
                id="gymSlug"
                placeholder={t("gym.yourGymName")}
                error={errors.gymSlug ? t(errors.gymSlug.message!) : undefined}
                {...register("gymSlug")}
              />
              <p className="text-sm text-muted-foreground">
                {t("gym.bookingPageUrl")} {window.location.origin}/gym/{gymSlug || t("gym.yourGymName")}
              </p>
            </div>

            {/* Contact Email & Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-2.5">
                <Label htmlFor="contactEmail" className="flex items-center gap-1.5">
                  {t("gym.contactEmail")}
                </Label>
                <Input
                  id="contactEmail"
                  type="email"
                  placeholder={t("gym.yourContactEmail")}
                  error={errors.contactEmail ? t(errors.contactEmail.message!) : undefined}
                  {...register("contactEmail")}
                />
              </div>
              <div className="flex flex-col gap-2.5">
                <Label htmlFor="contactPhone" className="flex items-center gap-1.5">
                  {t("gym.contactPhone")}
                </Label>
                <Input
                  id="contactPhone"
                  type="tel"
                  placeholder={t("gym.yourContactPhone")}
                  error={errors.contactPhone ? t(errors.contactPhone.message!) : undefined}
                  {...register("contactPhone")}
                />
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {t("gym.enableFeatures")}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};