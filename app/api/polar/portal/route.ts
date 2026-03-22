import { NextResponse } from "next/server";
import { polar } from "@/lib/polar";
import { getSession } from "@/lib/auth-utils";
import { getSubscription } from "@/db/actions/subscriptions";

export async function GET() {
  const session = await getSession();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const sub = await getSubscription();
  if (!sub.polarCustomerId) {
    // No Polar customer yet — send to pricing page
    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
    return NextResponse.redirect(`${appUrl}/pricing`);
  }

  // Create a short-lived customer portal session
  const portalSession = await polar.customerSessions.create({
    customerId: sub.polarCustomerId,
  });

  return NextResponse.redirect(portalSession.customerPortalUrl);
}
