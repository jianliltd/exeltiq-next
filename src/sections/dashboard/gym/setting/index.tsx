import { GymBranding } from "./gym-branding";
import { GymSetting } from "./gym-setting";
import { PaymentSetup } from "./payment-setup";
import { ContactInfo } from "./contact-info";

export const Setting = () => {
  return (
    <div className="space-y-4">
      <GymSetting />
      <GymBranding />
      <ContactInfo />
      <PaymentSetup />
    </div>
  );
};