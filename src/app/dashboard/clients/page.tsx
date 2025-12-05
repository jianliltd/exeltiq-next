"use client";

import { ClientsView } from "@/sections/dashboard/clients/list";

// Prevent static generation - this page requires Clerk authentication
export const dynamic = "force-dynamic";

export default function ClientsPage() {
  return <ClientsView />;
}
