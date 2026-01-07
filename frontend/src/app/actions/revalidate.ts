"use server";

import { revalidatePath } from "next/cache";

export async function revalidateCalendarPage() {
  revalidatePath("/calendar", "page");
}
