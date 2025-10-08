"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
  { name: "Calender", href: "/calendar" },
  { name: "Profil", href: "/profile" },
  { name: "Inställningar", href: "/settings" },
  { name: "Admin", href: "/admin" },
];

const Header = () => {
  const pathname = usePathname();
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
          {navLinks.map((link, key) => {
            const isActive =
              pathname === link.href ||
              (pathname.startsWith(link.href) && link.href !== "/");
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`px-3 py-1 rounded-md transition-colors duration-300 ${
                  isActive
                    ? "bg-[#FF7518]/60"
                    : "hover:bg-[#FF7518]/60"
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>
      </div>
      <Link href="/">Login</Link>
    </header>
  );
};

export default Header;
