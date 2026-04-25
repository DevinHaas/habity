"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { BottomNav } from "@/components/layout/BottomNav";

export function GoalsSkeleton() {
  return (
    <div className="min-h-screen bg-card flex flex-col max-w-2xl mx-auto">
      {/* Hero section placeholder */}
      <div className="relative h-[280px] flex-shrink-0 bg-muted animate-pulse" />

      {/* Main content */}
      <main className="flex-1 bg-card rounded-t-[2.5rem] -mt-8 relative z-20 pb-32">
        <div className="mx-auto max-w-lg px-6 pt-6">
          {/* Section header */}
          <div className="flex items-center justify-between mb-4">
            <Skeleton className="h-6 w-32" />
          </div>

          {/* Goal card skeletons */}
          <div className="space-y-3">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="flex items-center gap-4 rounded-2xl border border-border p-4"
              >
                {/* Image/emoji placeholder */}
                <Skeleton className="h-14 w-14 rounded-xl flex-shrink-0" />

                {/* Text + progress */}
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-2/3" />
                  <Skeleton className="h-2 w-full rounded-full" />
                  <Skeleton className="h-3 w-1/3" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
