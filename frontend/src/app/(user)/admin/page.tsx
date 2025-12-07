import { Metadata } from "next";
import CheckAuthStatus from "@/app/(user)/auth/CheckAuthStatus";
import { redirect } from "next/navigation";
import HealthBanner from "@/app/components/HealthBanner";

export const metadata: Metadata = {
  title: "Admin | Dagbok",
};

const AdminPage = () => {
  const user = CheckAuthStatus();

  if (user) {
    redirect("/profile");
  }

  return (
    <div className="w-full min-h-screen pt-5">
      <div className="flex justify-left items-start w-[256px]">
        <div className="max-w-screen-lg w-full px-4 h-full">
          <HealthBanner />
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
