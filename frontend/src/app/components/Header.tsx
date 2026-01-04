"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { User } from "@/lib/props";

const navLinks = [
  { name: "Dagbok cloud", href: "/" },
  { name: "Om oss", href: "/about" },
];

const calendarLink = {
  name: "Kalender",
  href: "/calendar",
  icon: (
    <svg
      className="w-6 h-6"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
      />
    </svg>
  ),
};

const profileLink = {
  name: "Profil",
  href: "/profile",
  icon: (
    <svg
      className="w-6 h-6"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
      />
    </svg>
  ),
};

const settingsLink = {
  name: "Inställningar",
  href: "/settings",
  icon: (
    <svg
      className="w-6 h-6"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
      />
    </svg>
  ),
};

const adminLink = {
  name: "Admin",
  href: "/admin",
  icon: (
    <svg
      className="w-6 h-6"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
      />
    </svg>
  ),
};

const homeLink = {
  name: "Hem",
  href: "/",
  icon: (
    <svg
      className="w-6 h-6"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
      />
    </svg>
  ),
};

interface HeaderProps {
  user: User | null;
}

const Header = ({ user }: HeaderProps) => {
  const pathname = usePathname();

  const authenticatedLinks = [
    ...navLinks,
    calendarLink,
    profileLink,
    settingsLink,
  ];

  let visibleLinks;
  let mobileLinks;

  if (!user) {
    visibleLinks = navLinks;
    mobileLinks = [homeLink];
  } else if (user.role === "ADMIN") {
    visibleLinks = [...authenticatedLinks, adminLink];
    mobileLinks = [
      homeLink,
      calendarLink,
      profileLink,
      settingsLink,
      adminLink,
    ];
  } else {
    visibleLinks = authenticatedLinks;
    mobileLinks = [homeLink, calendarLink, profileLink, settingsLink];
  }

  return (
    <>
      {/* Desktop Header */}
      <header className="hidden md:flex items-center justify-between px-6 lg:px-6 py-3 border-b-2 border-b-[#3F3D3D] bg-[#2A2A2A]">
        <div className="flex items-center gap-10">
          <Link href="/">
            <Image
              src="/icon.svg"
              alt="Dagbok Cloud Logo"
              width={32}
              height={32}
            />
          </Link>
          <nav className="flex items-center gap-4 lg:gap-6">
            {visibleLinks.map((link) => {
              const isActive =
                pathname === link.href ||
                (pathname.startsWith(link.href) && link.href !== "/");
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`px-3 py-1 rounded-md transition-colors duration-300 whitespace-nowrap ${
                    isActive ? "bg-[#FF7518]/60" : "hover:bg-[#FF7518]/60"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>
        </div>
        <div className="flex items-center gap-4">
          {user ? (
            <span className="text-sm text-gray-300 truncate">
              Hej, {user.name}
            </span>
          ) : (
            <Link
              href="/login"
              className="px-4 py-2 text-sm rounded-lg bg-[#FF7518] hover:bg-[#ff8833] transition-colors"
            >
              Logga in
            </Link>
          )}
        </div>
      </header>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#2A2A2A] border-t-2 border-t-[#3F3D3D] pb-safe">
        <div className="flex items-center justify-around px-2 py-2">
          {mobileLinks.map((link) => {
            const isActive =
              pathname === link.href ||
              (pathname.startsWith(link.href) && link.href !== "/");
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-colors min-w-[60px] ${
                  isActive ? "text-[#FF7518]" : "text-gray-400 hover:text-white"
                }`}
              >
                {link.icon}
                <span className="text-xs font-medium">{link.name}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
};

export default Header;
