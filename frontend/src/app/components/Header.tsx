"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { User } from "@/lib/props";
import { useState } from "react";

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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const authenticatedLinks = [
    ...navLinks,
    calendarLink,
    profileLink,
    settingsLink,
  ];

  let visibleLinks;

  if (!user) {
    visibleLinks = navLinks;
  } else if (user.role === "ADMIN") {
    visibleLinks = [...authenticatedLinks, adminLink];
  } else {
    visibleLinks = authenticatedLinks;
  }

  return (
    <header className="relative flex items-center justify-between px-3 py-3 sm:px-6 lg:px-6 border-b-2 border-b-[#3F3D3D] bg-[#2A2A2A]">
      <div className="flex items-center gap-4 sm:gap-10">
        <Link href="/">
          <Image
            src="/icon.svg"
            alt="Dagbok Cloud Logo"
            width={32}
            height={32}
          />
        </Link>
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-4 lg:gap-6 lg:px-6">
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
        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-3 rounded-md hover:bg-[#FF7518]/60 transition-colors"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
          aria-expanded={mobileMenuOpen}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {mobileMenuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </div>
      <div className="flex items-center gap-4">
        {user ? (
          <span className="text-xs sm:text-sm text-gray-300 truncate max-w-32 sm:max-w-none">
            Hej, {user.name}
          </span>
        ) : (
          <Link
            href="/login"
            className="px-3 sm:px-4 py-2 text-sm rounded-lg bg-[#FF7518] hover:bg-[#ff8833] transition-colors min-h-[44px]"
          >
            Logga in
          </Link>
        )}
      </div>
      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <nav className="md:hidden absolute top-full left-0 right-0 bg-[#2A2A2A] border-b-2 border-b-[#3F3D3D] shadow-lg z-50">
          <div className="flex flex-col p-4 gap-2">
            {visibleLinks.map((link) => {
              const isActive =
                pathname === link.href ||
                (pathname.startsWith(link.href) && link.href !== "/");
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`px-4 py-3 rounded-md transition-colors duration-300 min-h-[44px] flex items-center ${
                    isActive ? "bg-[#FF7518]/60" : "hover:bg-[#FF7518]/60"
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.name}
                </Link>
              );
            })}
          </div>
        </nav>
      )}
    </header>
  );
};

export default Header;
