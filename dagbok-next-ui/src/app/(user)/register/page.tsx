import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Register | Dagbok",
};

import Register from "@/app/(user)/register/Register";
import CheckAuthStatus from "@/app/(user)/auth/CheckAuthStatus";
import {redirect} from "next/navigation";

const RegisterPage = () => {
  const user = CheckAuthStatus();

  if(user){
    redirect("/profile");
  }

  return <Register />;
};

export default RegisterPage;
