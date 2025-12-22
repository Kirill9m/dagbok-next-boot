import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login | Dagbok",
};

import Login from "@/app/(user)/login/Login";
import getUser from "@/app/actions/session";
import { redirect } from "next/navigation";

const LoginPage = async () => {
  const user = await getUser();

  if (user) {
    redirect("/profile");
  }

  return <Login />;
};

export default LoginPage;
