import { Suspense } from "react";
import { ClientProGate } from "@/components/shared/ProGate";
import { AddGoalContent } from "@/components/goals/AddGoalContent";

export default function AddGoalPage() {
  return (
    <Suspense>
      <ClientProGate>
        <AddGoalContent />
      </ClientProGate>
    </Suspense>
  );
}
