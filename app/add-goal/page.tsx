import { getUserTier } from "@/db/actions/subscriptions";
import { ProGate } from "@/components/shared/ProGate";
import { AddGoalContent } from "@/components/goals/AddGoalContent";

export default async function AddGoalPage() {
  const tier = await getUserTier();
  const hasPro = tier === "pro" || tier === "max";

  return (
    <ProGate hasPro={hasPro}>
      <AddGoalContent />
    </ProGate>
  );
}
