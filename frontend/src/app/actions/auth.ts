"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function logout() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken");

  if (accessToken?.value) {
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/logout`, {
      method: "POST",
      credentials: "include",
    }).catch((error) => {
      console.error("Logout API call failed:", error);
    });
  }

  cookieStore.delete("accessToken");
  redirect("/");
}
