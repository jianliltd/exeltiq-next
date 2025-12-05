'use client';

import { useState } from "react";

import { HeaderSection } from "./header-section/header-section";
import { HeroSection } from "./hero-section/hero-section";
import { FeaturesSection } from "./features-section/features-section";
import { BenefitsSection } from "./benefits-section/benefits-section";
import { ModulesSection } from "./modules-section/modules-section";
import { CTASection } from "./cta-section/cta-section";
import { FooterSection } from "./footer-section/footer-section";
import { MobileMenuSection } from "./mobile-menu-section/mobile-menu-section";

type LandingPageProps = {
  onShowAuth: () => void;
};

export const LandingPage = ({ onShowAuth }: LandingPageProps) => {

const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <HeaderSection onShowAuth={onShowAuth} mobileMenuOpen={mobileMenuOpen} setMobileMenuOpen={setMobileMenuOpen}/>
      {mobileMenuOpen && <MobileMenuSection setMobileMenuOpen={setMobileMenuOpen}/>}
      <HeroSection/>
      <FeaturesSection/>
      <BenefitsSection/>
      <ModulesSection/>
      <CTASection/>
      <FooterSection/>
    </div>
  );
};