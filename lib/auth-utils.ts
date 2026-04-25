import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "./auth";

export async function getSession() {
  const headersList = await headers();

  console.log("[Auth Utils] getSession called");
  const session = await auth.api.getSession({
    headers: headersList,
  });

  console.log("[Auth Utils] getSession result:", session ? `user=${session.user?.id}` : "null");
  return session;
}

export async function getCurrentUserId(): Promise<string> {
  const session = await getSession();

  if (!session?.user?.id) {
    console.warn("[Auth Utils] getCurrentUserId: no session, redirecting to /login");
    redirect("/login");
  }

  return session.user.id;
}
