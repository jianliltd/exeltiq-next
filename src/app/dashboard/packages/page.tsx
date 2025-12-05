"use client";

import { PackagesView } from "@/sections/dashboard/packages";

// Prevent static generation - this page requires Clerk authentication
export const dynamic = "force-dynamic";

export default function PackagesPage() {
  return <PackagesView />;
}
