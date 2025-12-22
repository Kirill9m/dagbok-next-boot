"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { User } from "@/lib/props";

const navLinks = [{ name: "Dagbok cloud", href: "/" }];

const calendarLink = { name: "Kalender", href: "/calendar" };
const profileLink = { name: "Profil", href: "/profile" };
const settingsLink = { name: "Inställningar", href: "/settings" };
const adminLink = { name: "Admin", href: "/admin" };

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
  const visibleLinks = !user
    ? navLinks
    : user.role === "ADMIN"
      ? [...authenticatedLinks, adminLink]
      : authenticatedLinks;

  return (
    <header className="flex items-center justify-between px-3 py-3 sm:px-6 lg:px-6 border-b-2 border-b-[#3F3D3D] bg-[#2A2A2A]">
      <div className={"flex items-center gap-10"}>
        <Link href="/">
          <Image
            src="/icon.svg"
            alt="Dagbok Cloud Logo"
            width={32}
            height={32}
          />
        </Link>
        <nav className="flex items-center gap-6 lg:px-6">
          {visibleLinks.map((link) => {
            const isActive =
              pathname === link.href ||
              (pathname.startsWith(link.href) && link.href !== "/");
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`px-3 py-1 rounded-md transition-colors duration-300 ${
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
          <span className="text-sm text-gray-300">Hej, {user.name}</span>
        ) : (
          <Link
            href="/login"
            className="px-4 py-2 rounded-lg bg-[#FF7518] hover:bg-[#ff8833] transition-colors"
          >
            Logga in
          </Link>
        )}
      </div>
    </header>
  );
};

export default Header;
