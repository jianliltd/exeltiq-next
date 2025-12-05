"use client";

import { ClientViewDetail } from "@/sections/dashboard/clients/view-detail";

// Prevent static generation - this page requires Clerk authentication
export const dynamic = "force-dynamic";

export default function ClientViewDetailPage() {
  return <ClientViewDetail />;
}
