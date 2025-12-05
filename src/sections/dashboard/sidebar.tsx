'use client';

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { DollarSign, Users, Dumbbell, Package, Mail, X } from "lucide-react";
import { cn } from "@/lib/utils";
import useTranslate from "@/hook/use-translate";
import { dashboardRoutes } from "@/path";
interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const navItems = [
  { key: "gym", href: dashboardRoutes.gym, icon: Dumbbell },
  { key: "revenue", href: dashboardRoutes.revenue, icon: DollarSign },
  { key: "clients", href: dashboardRoutes.clients, icon: Users },
  { key: "packages", href: dashboardRoutes.packages, icon: Package },
  { key: "email", href: dashboardRoutes.email, icon: Mail },
];

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const { t } = useTranslate();

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-50 h-screen w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:relative lg:z-auto lg:h-auto shrink-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <Link href="/dashboard">
            <Image
              src="/exeltiqlogo.svg"
              alt="ExeltIQ Logo"
              width={120}
              height={32}
              className="h-8 w-auto"
            />
          </Link>
          <button
            onClick={onClose}
            className="lg:hidden p-2 rounded-md hover:bg-gray-100"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="px-3 py-4 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href || 
              pathname.startsWith(item.href + "/");
            const Icon = item.icon;

            return (
              <Link
                key={item.key}
                href={item.href}
                onClick={onClose}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                  isActive
                    ? "bg-blue-600 text-white"
                    : "text-gray-700 hover:bg-gray-100"
                )}
              >
                <Icon className="h-5 w-5" />
                <span>{t(`nav.${item.key}`)}</span>
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}

