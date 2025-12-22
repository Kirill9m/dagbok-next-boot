import { cookies } from "next/headers";

const getUser = async (): Promise<User | null> => {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken");

    if (!accessToken?.value) {
      return null;
    }

    const res = await fetch("http://localhost:8080/user/me", {
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
