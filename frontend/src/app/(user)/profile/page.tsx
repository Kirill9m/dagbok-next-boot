import { Metadata } from "next";
import Profile from "./Profile";

export const metadata: Metadata = {
  title: "User profile | Dagbok",
};

const ProfilePage = () => {
  return <Profile />;
};

export default ProfilePage;
