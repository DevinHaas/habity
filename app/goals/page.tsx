import { getUserTier } from "@/db/actions/subscriptions";
import { ProGate } from "@/components/shared/ProGate";
import { GoalsContent } from "@/components/goals/GoalsContent";

export default async function GoalsPage() {
  const tier = await getUserTier();
  const hasPro = tier === "pro" || tier === "max";

  return (
    <ProGate hasPro={hasPro}>
      <GoalsContent />
    </ProGate>
  );
}
