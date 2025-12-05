"use client";

import { GymView } from "@/sections/dashboard/gym";


// Prevent static generation - this page requires Clerk authentication
export const dynamic = "force-dynamic";

export default function GymPage() {
  return <GymView />;
}
