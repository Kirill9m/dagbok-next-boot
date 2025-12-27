import { Metadata } from "next";
import getUser from "@/app/actions/session";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Inställningar | Dagbok",
};

const settingsPage = async () => {
  const user = await getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <main className={"min-h-screen flex items-center justify-center"}>
      <div className="bg-[#2A2A2A] backdrop-blur-xl rounded-2xl p-8 w-full max-w-md shadow-2xl border border-white/10">
        <h1 className={"text-2xl font-semibold text-center mb-6"}>
          Inställningar
        </h1>
        <div className={"justify-center text-center mb-6"}>
          <div>Prompt:</div>
          <div className="relative rounded-lg p-6 w-96 max-w-[90vw] shadow-2xl">
            {user.prompt}
          </div>
          <button
            className="text-gray-400 flex justify-end hover:text-white transition"
            aria-label="Stäng"
          >
            ändra
          </button>
        </div>
      </div>
    </main>
  );
};

export default settingsPage;
