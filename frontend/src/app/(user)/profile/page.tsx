import { Metadata } from "next";
import getUser from "@/app/actions/session";
import { redirect } from "next/navigation";
import { logout } from "@/app/actions/auth";

export const metadata: Metadata = {
  title: "Användarprofil | Dagbok",
};

const ProfilePage = async () => {
  const user = await getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <main className={"min-h-screen flex items-center justify-center"}>
      <div className="bg-[#2A2A2A] backdrop-blur-xl rounded-2xl p-8 w-full max-w-md shadow-2xl border border-white/10">
        <h1 className={"text-2xl font-semibold text-center mb-6"}>Profil</h1>
        <div className={"justify-center text-center mb-6"}>
          <div>Användare: {user.name}</div>
          <div>Email: {user.email}</div>
        </div>
        <form action={logout}>
          <button
            type="submit"
            className="px-4 py-2 rounded-lg bg-[#FF7518] hover:bg-[#ff8833] text-white font-medium transition-all duration-300 w-full"
          >
            Logga ut
          </button>
        </form>
      </div>
    </main>
  );
};

export default ProfilePage;
