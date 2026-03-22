import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "./auth";

export async function getSession() {
  const headersList = await headers();

  const session = await auth.api.getSession({
    headers: headersList,
  });

  return session;
}

export async function getCurrentUserId(): Promise<string> {
  const session = await getSession();

  if (!session?.user?.id) {
    redirect("/login");
  }

  return session.user.id;
}
