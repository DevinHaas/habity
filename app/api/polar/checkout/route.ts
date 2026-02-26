import { NextRequest, NextResponse } from "next/server";
import { polar, POLAR_PRODUCT_IDS, type PolarProductKey } from "@/lib/polar";
import { getSession } from "@/lib/auth-utils";

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { tier } = (await req.json()) as { tier: PolarProductKey };

  const productId = POLAR_PRODUCT_IDS[tier];
  if (!productId) {
    return NextResponse.json({ error: "Invalid tier" }, { status: 400 });
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  const checkout = await polar.checkouts.create({
    products: [productId],
    customerEmail: session.user.email,
    // externalCustomerId links the Polar customer to our userId, enabling
    // retrieval via customer.externalId in webhook payloads
    externalCustomerId: session.user.id,
    metadata: {
      userId: session.user.id,
      tier,
    },
    successUrl: `${appUrl}/pricing?success=true`,
  });

  return NextResponse.json({ url: checkout.url });
}
