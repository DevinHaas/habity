"use client";

import { cn } from "@/lib/utils";

function SkeletonBox({ className }: { className?: string }) {
  return (
    <div className={cn("animate-pulse rounded bg-muted", className)} />
  );
}

function GoalCardSkeleton() {
  return (
    <div className="relative flex items-center gap-4 rounded-2xl bg-card p-4 shadow-sm border border-border">
      {/* Image placeholder */}
      <SkeletonBox className="h-20 w-20 rounded-xl shrink-0" />

      {/* Content */}
      <div className="flex-1 min-w-0 space-y-2">
        {/* Category */}
        <SkeletonBox className="h-3 w-16 rounded" />
        {/* Name */}
        <SkeletonBox className="h-5 w-2/3 rounded" />
        {/* Progress label */}
        <SkeletonBox className="h-3 w-10 rounded" />
        {/* Progress bar */}
        <SkeletonBox className="h-2 w-full rounded-full" />
        {/* Values */}
        <SkeletonBox className="h-3.5 w-1/2 rounded" />
      </div>

      {/* Menu button */}
      <SkeletonBox className="h-8 w-8 rounded-full shrink-0" />
    </div>
  );
}

export function GoalListSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <GoalCardSkeleton key={i} />
      ))}
    </div>
  );
}
