import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login | Dagbok",
};

import Login from "@/app/(user)/login/Login";
import CheckAuthStatus from "@/app/(user)/auth/CheckAuthStatus";
import { redirect } from "next/navigation";

const LoginPage = () => {
  const user = CheckAuthStatus();

  if (user) {
    redirect("/profile");
  }

  return <Login />;
};

export default LoginPage;
