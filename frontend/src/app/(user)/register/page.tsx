import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Register | Dagbok",
};

import Register from "@/app/(user)/register/Register";
import getUser from "@/app/actions/session";
import { redirect } from "next/navigation";

const RegisterPage = async () => {
  const user = await getUser();

  if (user) {
    redirect("/profile");
  }

  return <Register />;
};

export default RegisterPage;
