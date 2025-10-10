import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login | Dagbok",
};

import Login from "@/app/(user)/login/Login";

const LoginPage = () => {
  return <Login />;
};

export default LoginPage;
