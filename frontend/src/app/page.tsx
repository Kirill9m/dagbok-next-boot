import HomePage from "@/app/components/HomePage";
import getUser from "@/app/actions/session";

export default async function Home() {
  const user = await getUser();

  return <HomePage user={user} />;
}
