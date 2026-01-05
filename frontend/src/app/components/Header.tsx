"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { User } from "@/lib/props";
import {
  LogoIcon,
  CalendarIcon,
  ProfileIcon,
  SettingsIcon,
  AdminIcon,
  HomeIcon,
  LoginIcon,
} from "@/app/components/icons";

const navLinks = [
  { name: "Dagbok cloud", href: "/" },
  { name: "Om oss", href: "/about" },
];

const calendarLink = {
  name: "Kalender",
  href: "/calendar",
  icon: <CalendarIcon />,
};

const profileLink = {
  name: "Profil",
  href: "/profile",
  icon: <ProfileIcon />,
};

const settingsLink = {
  name: "Inställningar",
  href: "/settings",
  icon: <SettingsIcon />,
};

const adminLink = {
  name: "Admin",
  href: "/admin",
  icon: <AdminIcon />,
};

const homeLink = {
  name: "Hem",
  href: "/",
  icon: <HomeIcon />,
};

const loginLink = {
  name: "Logga in",
  href: "/login",
  icon: <LoginIcon />,
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
    mobileLinks = [homeLink, loginLink];
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
            <LogoIcon />
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
