"use client";

import { logout } from "@/app/actions/auth";

export default function LogoutButton() {
  const handleLogout = async () => {
    try {
      localStorage.removeItem("demoSessionStart");
      await logout();
    } catch (e) {
      console.error("Logout error:", e);
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="w-full rounded-lg bg-[#FF7518] px-4 py-2 font-medium text-white transition-all duration-300 hover:bg-[#ff8833]"
    >
      Logga ut
    </button>
  );
}
