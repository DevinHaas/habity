import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "./auth";

export async function getSession() {
  console.log("[AUTH] getSession called");
  const headersList = await headers();
  console.log("[AUTH] Headers:", {
    cookie: headersList.get("cookie"),
    host: headersList.get("host"),
    origin: headersList.get("origin"),
  });

  const session = await auth.api.getSession({
    headers: headersList,
  });

  console.log("[AUTH] Session result:", {
    hasSession: !!session,
    hasUser: !!session?.user,
    userId: session?.user?.id,
  });

  return session;
}

export async function getCurrentUserId(): Promise<string> {
  console.log("[AUTH] getCurrentUserId called");
  const session = await getSession();

  if (!session?.user?.id) {
    console.log("[AUTH] No session/user found, redirecting to /login");
    redirect("/login");
  }

  console.log("[AUTH] User authenticated:", session.user.id);
  return session.user.id;
}
