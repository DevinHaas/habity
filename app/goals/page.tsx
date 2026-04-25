import { Suspense } from "react";
import { ClientProGate } from "@/components/shared/ProGate";
import { GoalsContent } from "@/components/goals/GoalsContent";
import { GoalsSkeleton } from "@/components/goals/GoalsSkeleton";

export default function GoalsPage() {
  return (
    <Suspense fallback={<GoalsSkeleton />}>
      <ClientProGate fallback={<GoalsSkeleton />}>
        <GoalsContent />
      </ClientProGate>
    </Suspense>
  );
}
