"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function logout() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken");

  if (accessToken?.value) {
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/logout`, {
      method: "POST",
      credentials: "include",
    }).catch(() => {});
  }

  cookieStore.delete("accessToken");
  redirect("/");
}
