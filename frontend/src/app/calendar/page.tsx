import { requireAuth } from "@/app/actions/session";
import CalendarHandler from "./CalendarHandler";

export const metadata = {
  title: "Kalender | Dagbok",
  description: "Planera din månad och skriv anteckningar per dag.",
};

const CalendarPage = async () => {
  const user = await requireAuth();

  return <CalendarHandler user={user} />;
};

export default CalendarPage;
