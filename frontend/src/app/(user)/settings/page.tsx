import { Metadata } from "next";
import getUser from "@/app/actions/session";
import { redirect } from "next/navigation";
import SettingsForm from "@/app/(user)/settings/SettingsForm";

export const metadata: Metadata = {
  title: "Inställningar | Dagbok",
};

const settingsPage = async () => {
  const user = await getUser();

  if (!user) {
    redirect("/login");
  }

  return <SettingsForm user={user} />;
};

export default settingsPage;
