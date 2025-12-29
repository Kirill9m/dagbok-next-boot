import { cookies } from "next/headers";
import { User } from "@/lib/props";

const getUser = async (): Promise<User | null> => {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken");

    if (!accessToken?.value) {
      return null;
    }

    const apiBase =
      process.env.INTERNAL_API_URL ||
      process.env.NEXT_PUBLIC_API_URL ||
      "http://localhost:8081";
    const res = await fetch(`${apiBase}/user/me`, {
      method: "GET",
      headers: {
        Cookie: `accessToken=${accessToken.value}`,
      },
      cache: "no-store",
    });

    if (!res.ok) {
      return null;
    }

    return await res.json();
  } catch (error) {
    console.error("Error checking auth status:", error);
    return null;
  }
};

export default getUser;
