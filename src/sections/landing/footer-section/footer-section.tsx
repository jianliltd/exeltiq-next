import Image from "next/image";

import useTranslate from "@/hook/use-translate";

export const FooterSection = () => {
  const { t } = useTranslate();

  return (
    <footer className="border-t border-border bg-white py-12">
    <div className="container mx-auto px-6">
      <div className="grid md:grid-cols-4 gap-8">
        <div>
          <Image src={'/exeltiqlogo.svg'} alt="Exeltiq logo" className="w-[140px] pb-2" width={140} height={140} />
          <p className="text-sm text-muted-foreground">
            {t("landing.footerDescription")}
          </p>
        </div>
        <div>
          <h4 className="font-semibold mb-4">{t("landing.product")}</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>
              <a
                href="#"
                className="hover:text-foreground transition-colors"
              >
                {t("landing.features")}
              </a>
            </li>
            <li>
              <a
                href="#"
                className="hover:text-foreground transition-colors"
              >
                {t("landing.pricing")}
              </a>
            </li>
            <li>
              <a
                href="#"
                className="hover:text-foreground transition-colors"
              >
                {t("landing.security")}
              </a>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-4">{t("landing.company")}</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>
              <a
                href="#"
                className="hover:text-foreground transition-colors"
              >
                {t("landing.about")}
              </a>
            </li>
            <li>
              <a
                href="#"
                className="hover:text-foreground transition-colors"
              >
                {t("landing.blog")}
              </a>
            </li>
            <li>
              <a
                href="#"
                className="hover:text-foreground transition-colors"
              >
                {t("landing.careers")}
              </a>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-4">{t("landing.support")}</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>
              <a
                href="#"
                className="hover:text-foreground transition-colors"
              >
                {t("landing.helpCenter")}
              </a>
            </li>
            <li>
              <a
                href="#"
                className="hover:text-foreground transition-colors"
              >
                {t("landing.contact")}
              </a>
            </li>
            <li>
              <a
                href="#"
                className="hover:text-foreground transition-colors"
              >
                {t("landing.status")}
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="mt-12 pt-8 border-t border-border flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
        <p>{t("landing.copyright")}</p>
        <p className="flex items-center gap-2">{t("landing.createdWith")} <a href="https://wwww.exeltive.com"><Image src={'/exeltive.svg'} alt="Exeltive Logo" className="w-[100px] pb-2" width={100} height={100} /></a></p>
      </div>
    </div>
  </footer>
  );
};