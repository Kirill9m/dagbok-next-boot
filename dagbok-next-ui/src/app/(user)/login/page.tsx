import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login | Dagbok",
};

import Login from "@/app/(user)/login/Login";

const RegisterPage = () => {
  return <Login />;
};

export default RegisterPage;
