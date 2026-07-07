import { Suspense } from "react";
import { GoalsContent } from "@/components/goals/GoalsContent";
import { GoalsSkeleton } from "@/components/goals/GoalsSkeleton";

export default function GoalsPage() {
  return (
    <Suspense fallback={<GoalsSkeleton />}>
      <GoalsContent />
    </Suspense>
  );
}
