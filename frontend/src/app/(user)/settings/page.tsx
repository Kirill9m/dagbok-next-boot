import { Metadata } from "next";
import { requireAuth } from "@/app/actions/session";
import SettingsForm from "@/app/(user)/settings/SettingsForm";

export const metadata: Metadata = {
  title: "Inställningar | Dagbok",
};

const settingsPage = async () => {
  const user = await requireAuth();

  return <SettingsForm user={user} />;
};

export default settingsPage;
