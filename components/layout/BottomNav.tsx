"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Home, BarChart3, Plus, Trophy } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const navItems = [
  {
    href: "/",
    icon: Home,
    label: "Home",
  },
  {
    href: "/goals",
    icon: Trophy,
    label: "Goals",
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

interface FloatingAddButtonProps {
  href?: string;
  color?: "brown" | "olive";
  variant?: "fixed" | "relative";
}

export function FloatingAddButton({ href = "/add-habit", color = "brown", variant = "fixed" }: FloatingAddButtonProps) {
  const pathname = usePathname();

  // Don't show on add-habit or add-goal pages
  if (pathname === "/add-habit" || pathname === "/add-goal") {
    return null;
  }

  const bgColor = color === "olive" ? "bg-olive shadow-olive/30" : "bg-brown shadow-brown/30";
  const positionClass = variant === "fixed" 
    ? "fixed bottom-24 right-4 z-50" 
    : "relative z-10";

  return (
    <Link href={href}>
      <motion.button
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
        className={cn(
          positionClass,
          "flex h-14 w-14 items-center justify-center rounded-full text-white shadow-lg",
          bgColor
        )}
      >
        <motion.div
          initial={{ rotate: -180, opacity: 0 }}
          animate={{ rotate: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.1 }}
        >
          <Plus className="h-7 w-7" />
        </motion.div>
      </motion.button>
    </Link>
  );
}
