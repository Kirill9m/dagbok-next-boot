import { Metadata } from "next";
import getUser from "@/app/actions/session";
import { redirect } from "next/navigation";
import HealthBanner from "@/app/(user)/admin/HealthBanner";

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
      <div className="flex justify-start items-start w-full px-4">
        <div className="max-w-5xl w-full">
          <HealthBanner />
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
