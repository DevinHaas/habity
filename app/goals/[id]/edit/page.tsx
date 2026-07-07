import { EditGoalContent } from "@/components/goals/EditGoalContent";

export default async function EditGoalPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <EditGoalContent goalId={id} />;
}
