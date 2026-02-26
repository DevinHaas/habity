"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Check, Zap, Crown, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import type { SubscriptionTier } from "@/db/schema";

interface Plan {
  key: SubscriptionTier;
  name: string;
  price: number;
  description: string;
  icon: React.ElementType;
  iconColor: string;
  features: string[];
  highlighted?: boolean;
}

const plans: Plan[] = [
  {
    key: "free",
    name: "Free",
    price: 0,
    description: "Perfect for getting started",
    icon: Sparkles,
    iconColor: "text-muted-foreground",
    features: [
      "Unlimited habits",
      "Daily habit tracking",
      "Streak tracking",
      "Basic stats & analytics",
      "Level & XP system",
      "Coins & rewards",
    ],
  },
  {
    key: "pro",
    name: "Pro",
    price: 5,
    description: "For serious habit builders",
    icon: Zap,
    iconColor: "text-orange",
    highlighted: true,
    features: [
      "Everything in Free",
      "Goals & milestones",
      "Advanced progress tracking",
      "Priority support",
    ],
  },
  {
    key: "max",
    name: "Max",
    price: 10,
    description: "For power users",
    icon: Crown,
    iconColor: "text-amber-500",
    features: [
      "Everything in Pro",
      "Detailed analytics",
      "Custom goal criteria",
      "Early access to new features",
    ],
  },
];

interface PricingCardsProps {
  currentTier: SubscriptionTier;
  hasPolarCustomer: boolean;
}

export function PricingCards({ currentTier, hasPolarCustomer }: PricingCardsProps) {
  const [loading, setLoading] = useState<SubscriptionTier | null>(null);

  const handleSubscribe = async (tier: SubscriptionTier) => {
    if (tier === "free") return;

    setLoading(tier);
    try {
      const res = await fetch("/api/polar/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tier }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error ?? "Failed to create checkout");
      }

      const { url } = await res.json();
      window.location.href = url;
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
      setLoading(null);
    }
  };

  const handleManage = () => {
    window.location.href = "/api/polar/portal";
  };

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {plans.map((plan, index) => {
        const Icon = plan.icon;
        const isCurrent = plan.key === currentTier;
        const isDowngrade =
          (currentTier === "max" && plan.key === "pro") ||
          (currentTier !== "free" && plan.key === "free");

        return (
          <motion.div
            key={plan.key}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={cn(
              "relative flex flex-col rounded-3xl border p-6",
              plan.highlighted
                ? "border-orange/60 bg-orange/5 shadow-lg shadow-orange/10"
                : "border-border bg-card",
              isCurrent && "ring-2 ring-primary"
            )}
          >
            {plan.highlighted && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="rounded-full bg-orange px-3 py-1 text-xs font-bold text-white shadow">
                  Most Popular
                </span>
              </div>
            )}

            {isCurrent && (
              <div className="absolute -top-3 right-4">
                <span className="rounded-full bg-primary px-3 py-1 text-xs font-bold text-primary-foreground shadow">
                  Current Plan
                </span>
              </div>
            )}

            <div className="mb-4 flex items-center gap-3">
              <div
                className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-2xl",
                  plan.highlighted ? "bg-orange/15" : "bg-muted"
                )}
              >
                <Icon className={cn("h-5 w-5", plan.iconColor)} />
              </div>
              <div>
                <h3 className="font-bold text-foreground">{plan.name}</h3>
                <p className="text-xs text-muted-foreground">{plan.description}</p>
              </div>
            </div>

            <div className="mb-6">
              <div className="flex items-end gap-1">
                <span className="text-4xl font-extrabold text-foreground">
                  ${plan.price}
                </span>
                {plan.price > 0 && (
                  <span className="mb-1 text-sm text-muted-foreground">/mo</span>
                )}
              </div>
            </div>

            <ul className="mb-6 flex-1 space-y-2">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-start gap-2">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  <span className="text-sm text-foreground/80">{feature}</span>
                </li>
              ))}
            </ul>

            {plan.key === "free" ? (
              isCurrent ? (
                <Button variant="outline" disabled className="rounded-2xl">
                  Current Plan
                </Button>
              ) : (
                <Button
                  variant="outline"
                  onClick={handleManage}
                  className="rounded-2xl"
                >
                  Downgrade to Free
                </Button>
              )
            ) : isCurrent ? (
              <Button
                variant="outline"
                onClick={handleManage}
                className="rounded-2xl"
              >
                Manage Subscription
              </Button>
            ) : isDowngrade ? (
              <Button
                variant="outline"
                onClick={handleManage}
                className="rounded-2xl"
              >
                Downgrade
              </Button>
            ) : (
              <Button
                onClick={() => handleSubscribe(plan.key)}
                disabled={loading === plan.key}
                className={cn(
                  "rounded-2xl font-semibold",
                  plan.highlighted
                    ? "bg-orange hover:bg-orange/90 text-white"
                    : ""
                )}
              >
                {loading === plan.key ? "Redirecting…" : `Upgrade to ${plan.name}`}
              </Button>
            )}
          </motion.div>
        );
      })}
    </div>
  );
}
