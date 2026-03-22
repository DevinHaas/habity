import Link from "next/link";
import { Trophy, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";

interface UpgradePromptProps {
  title?: string;
  message?: string;
}

export function UpgradePrompt({
  title = "Pro Feature",
  message = "Upgrade to Pro to unlock this feature and track your long-term progress.",
}: UpgradePromptProps) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-6 text-center">
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-orange/10">
        <Lock className="h-10 w-10 text-orange" />
      </div>
      <h2 className="mb-2 text-2xl font-extrabold text-foreground">{title}</h2>
      <p className="mb-6 max-w-xs text-muted-foreground">{message}</p>
      <Link href="/pricing">
        <Button className="rounded-full bg-orange text-white hover:bg-orange/90 px-8 font-semibold">
          <Trophy className="mr-2 h-4 w-4" />
          Upgrade to Pro — $5/mo
        </Button>
      </Link>
      <p className="mt-4 text-xs text-muted-foreground">
        Cancel any time · Secure checkout via Polar
      </p>
    </div>
  );
}

/** @deprecated Use UpgradePrompt directly */
export function ProGate({ children, hasPro }: { children: React.ReactNode; hasPro: boolean }) {
  if (hasPro) return <>{children}</>;
  return <UpgradePrompt />;
}
