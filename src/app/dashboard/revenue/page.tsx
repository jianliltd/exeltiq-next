"use client";

import { RevenuseView } from "@/sections/dashboard/revenue";

// Prevent static generation - this page requires Clerk authentication
export const dynamic = "force-dynamic";

export default function RevenuePage() {
  return <RevenuseView />;
}
