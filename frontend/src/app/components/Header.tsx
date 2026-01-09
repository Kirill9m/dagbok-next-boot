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
import SessionTimer from "@/app/components/SessionTimer";

const navLinks = [
  { name: "Dagbok cloud", href: "/" },
  { name: "Info", href: "/info" },
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
      <header className="hidden items-center justify-between border-b-2 border-b-[#3F3D3D] bg-[#2A2A2A] px-6 py-3 md:flex lg:px-6">
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
                  className={`rounded-md px-3 py-1 whitespace-nowrap transition-colors duration-300 ${
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
            <SessionTimer user={user} className={"flex"} text={"Demo:"} />
          ) : (
            <Link
              href="/login"
              className="rounded-lg bg-[#FF7518] px-4 py-2 text-sm transition-colors hover:bg-[#ff8833]"
            >
              Logga in
            </Link>
          )}
        </div>
      </header>

      {/* Mobile Bottom Navigation */}
      <nav className="pb-safe fixed right-0 bottom-0 left-0 z-50 border-t-2 border-t-[#3F3D3D] bg-[#2A2A2A] md:hidden">
        <div className="flex items-center justify-around px-2 py-2">
          {mobileLinks.map((link) => {
            const isActive =
              pathname === link.href ||
              (pathname.startsWith(link.href) && link.href !== "/");
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`flex min-w-[60px] touch-manipulation flex-col items-center gap-1 rounded-lg px-3 py-3 transition-all duration-100 select-none [-webkit-tap-highlight-color:transparent] active:scale-95 active:bg-white/5 ${isActive ? "text-[#FF7518]" : "text-gray-400 active:text-gray-300"}`}
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
