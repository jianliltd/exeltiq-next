"use client";

import { EmailView } from "@/sections/dashboard/email";

// Prevent static generation - this page requires Clerk authentication
export const dynamic = "force-dynamic";

export default function EmailPage() {
  return <EmailView />;
}
