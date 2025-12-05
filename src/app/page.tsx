"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { LandingPage } from "@/sections/landing";

const HomePage: React.FC = () => {
  const { isLoaded, isSignedIn } = useUser();
  const router = useRouter();

  const handleShowAuth = useCallback(() => {
    if (isLoaded && !isSignedIn) {
      router.push("/sign-in");
    } else {
      router.push("/dashboard");
    }
  }, [isLoaded, isSignedIn, router]);

  return <LandingPage onShowAuth={handleShowAuth} />;
};

export default HomePage;
