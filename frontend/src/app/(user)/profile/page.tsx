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
    <main className={"flex min-h-screen items-center justify-center"}>
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#2A2A2A] p-8 shadow-2xl backdrop-blur-xl">
        <h1 className={"mb-6 text-center text-2xl font-semibold"}>Profil</h1>
        <div className={"mb-6 justify-center text-center"}>
          <div>Användare: {user.name}</div>
          <div>Email: {user.email}</div>
          <div>Model: {user.model}</div>
          <div>
            Månadskostnad:{" "}
            {user.monthlyCost != null
              ? `${user.monthlyCost.toFixed(6)} USD`
              : "–"}
          </div>
        </div>
        <form action={logout}>
          <button
            type="submit"
            className="w-full rounded-lg bg-[#FF7518] px-4 py-2 font-medium text-white transition-all duration-300 hover:bg-[#ff8833]"
          >
            Logga ut
          </button>
        </form>
      </div>
    </main>
  );
};

export default ProfilePage;
