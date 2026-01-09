"use client";

export default function LogoutButton() {
  const handleLogout = async () => {
    try {
      localStorage.removeItem("demoSessionStart");
    } catch (e) {
      console.error("Logout error:", e);
    }
  };

  return (
    <button
      onClick={handleLogout}
      type="submit"
      className="w-full rounded-lg bg-[#FF7518] px-4 py-2 font-medium text-white transition-all duration-300 hover:bg-[#ff8833]"
    >
      Logga ut
    </button>
  );
}
