"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Home, BarChart3, Plus } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const navItems = [
  {
    href: "/",
    icon: Home,
    label: "Home",
  },
  {
    href: "/stats",
    icon: BarChart3,
    label: "Stats",
  },
];

export function BottomNav() {
  const pathname = usePathname();

  // Don't show nav on add-habit page
  if (pathname === "/add-habit") {
    return null;
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border safe-area-bottom">
      <div className="mx-auto max-w-lg">
        <div className="flex items-center justify-around py-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "relative flex flex-col items-center justify-center px-6 py-2 rounded-xl transition-colors",
                  isActive
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="nav-indicator"
                    className="absolute inset-0 bg-primary/10 rounded-xl"
                    initial={false}
                    transition={{
                      type: "spring",
                      stiffness: 500,
                      damping: 35,
                    }}
                  />
                )}
                <Icon className="h-6 w-6 relative z-10" />
                <span className="text-xs mt-1 font-medium relative z-10">
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}

export function FloatingAddButton() {
  const pathname = usePathname();

  // Don't show on add-habit page
  if (pathname === "/add-habit") {
    return null;
  }

  return (
    <Link href="/add-habit">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-24 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-brown text-white shadow-lg shadow-brown/30"
      >
        <Plus className="h-7 w-7" />
      </motion.button>
    </Link>
  );
}
