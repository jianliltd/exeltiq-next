"use client";

import { redirect } from "next/navigation";
import { dashboardRoutes } from "@/path";
// Prevent static generation - this page requires Clerk authentication
export const dynamic = "force-dynamic";

export default function DashboardPage() {
  redirect(dashboardRoutes.index);
}
