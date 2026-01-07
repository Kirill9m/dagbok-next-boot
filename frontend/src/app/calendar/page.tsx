import getUser from "@/app/actions/session";

export const metadata = {
  title: "Kalender | Dagbok",
  description: "Planera din månad och skriv anteckningar per dag.",
};

import CalendarHandler from "./CalendarHandler";
import { redirect } from "next/navigation";

const CalendarPage = async () => {
  const user = await getUser();

  if (!user) {
    redirect("/login");
  }

  return <CalendarHandler user={user} />;
};

export default CalendarPage;
