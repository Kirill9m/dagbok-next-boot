import { Metadata } from "next";
import getUser from "@/app/actions/session";
import { redirect } from "next/navigation";
import SettingsModal from "@/app/(user)/settings/SettingsModal";

export const metadata: Metadata = {
  title: "Inställningar | Dagbok",
};

const settingsPage = async () => {
  const user = await getUser();

  if (!user) {
    redirect("/login");
  }

  return <SettingsModal user={user} />;
};

export default settingsPage;
