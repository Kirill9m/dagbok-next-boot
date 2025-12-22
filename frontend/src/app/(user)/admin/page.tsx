import { Metadata } from "next";
import getUser from "@/app/actions/session";
import { redirect } from "next/navigation";
import HealthBanner from "@/app/components/HealthBanner";
import NoteCreator from "@/app/components/(test)/NoteCreator";

export const metadata: Metadata = {
  title: "Admin | Dagbok",
};

const AdminPage = async () => {
  const user = await getUser();

  if (!user) {
    redirect("/login");
  }

  if (user.role !== "ADMIN") {
    redirect("/");
  }

  return (
    <div className="w-full min-h-screen pt-5">
      <div className="flex justify-start items-start w-[256px]">
        <div className="max-w-screen-lg w-full px-4 h-full">
          <HealthBanner />
          <NoteCreator />
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
