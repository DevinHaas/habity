"use client";

import { cn } from "@/lib/utils";

function SkeletonBox({ className }: { className?: string }) {
  return (
    <div className={cn("animate-pulse rounded bg-muted", className)} />
  );
}

function HabitCardSkeleton() {
  return (
    <div className="flex items-center gap-2.5 rounded-xl bg-card p-2.5 shadow-sm">
      {/* Checkbox */}
      <SkeletonBox className="h-5 w-5 rounded-full shrink-0" />
      {/* Icon */}
      <SkeletonBox className="h-9 w-9 rounded-lg shrink-0" />
      {/* Content */}
      <div className="flex-1 min-w-0 space-y-1.5">
        <SkeletonBox className="h-3.5 w-2/3 rounded" />
        <SkeletonBox className="h-3 w-1/3 rounded" />
      </div>
      {/* Duration */}
      <SkeletonBox className="h-3 w-10 rounded shrink-0" />
    </div>
  );
}

function TimeGroupSkeleton({ count }: { count: number }) {
  return (
    <div className="mb-4">
      {/* Time label */}
      <div className="flex items-center gap-2 mb-2">
        <SkeletonBox className="h-3.5 w-16 rounded" />
        <div className="flex-1 h-px bg-muted" />
      </div>
      <div className="space-y-2">
        {Array.from({ length: count }).map((_, i) => (
          <HabitCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}

export function HabitListSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-foreground">Daily routine</h2>
        <SkeletonBox className="h-4 w-12 rounded" />
      </div>
      <div>
        <TimeGroupSkeleton count={2} />
        <TimeGroupSkeleton count={1} />
      </div>
    </div>
  );
}
