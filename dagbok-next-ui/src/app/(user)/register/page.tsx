import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Register | Dagbok",
};

import Register from "@/app/(user)/register/Register";

const RegisterPage = () => {
  return <Register />;
};

export default RegisterPage;
