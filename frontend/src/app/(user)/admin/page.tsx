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
    <div className="min-h-screen w-full pt-5">
      <div className="flex w-full items-start justify-start px-4">
        <div className="w-full max-w-5xl">
          <HealthBanner />
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
