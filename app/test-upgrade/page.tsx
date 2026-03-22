"use client";

import { useState } from "react";
import { UpgradeScreen } from "@/components/shared/UpgradeScreen";
import { Button } from "@/components/ui/button";

export default function TestUpgradePage() {
  const [show, setShow] = useState(false);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <Button onClick={() => setShow(true)}>Play Upgrade Screen</Button>
      {show && <UpgradeScreen onDismiss={() => setShow(false)} />}
    </div>
  );
}
