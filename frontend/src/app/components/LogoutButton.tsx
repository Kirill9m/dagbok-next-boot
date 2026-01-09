"use client";

export default function LogoutButton() {
  return (
    <button
      type="submit"
      onClick={() => {
        // Clean up client-side session data
        try {
          localStorage.removeItem("demoSessionStart");
        } catch (e) {
          console.error("Failed to clear session data:", e);
        }
      }}
      className="w-full rounded-lg bg-[#FF7518] px-4 py-2 font-medium text-white transition-all duration-300 hover:bg-[#ff8833]"
    >
      Logga ut
    </button>
  );
}
