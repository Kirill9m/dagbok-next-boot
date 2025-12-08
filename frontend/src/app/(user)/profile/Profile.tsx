import { redirect } from "next/navigation";
import CheckAuthStatus from "@/app/(user)/auth/CheckAuthStatus";

const Profile = () => {
  const user = CheckAuthStatus();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className={"min-h-screen flex items-center justify-center"}>
      <div className="bg-[#2A2A2A] backdrop-blur-xl rounded-2xl p-8 w-full max-w-md shadow-2xl border border-white/10">
        <h1 className={"text-2xl font-semibold text-center mb-6"}>
          🥷 Profile
        </h1>
        <div className={"justify-center text-center mb-6"}>
          <div>Användare: {user.name}</div>
          <div>Email: {user.email}</div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
