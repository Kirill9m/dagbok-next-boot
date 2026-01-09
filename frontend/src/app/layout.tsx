import type { Metadata } from "next";
import "./globals.css";
import Header from "./components/Header";
import { Roboto } from "next/font/google";
import getUser from "@/app/actions/session";
import SessionTimer from "@/app/components/SessionTimer";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "600"],
  variable: "--roboto",
});

export const metadata: Metadata = {
  title: "Dagbok cloud | Time Reporting & Work Log System",
  description:
    "A modern, full-stack time reporting system for small businesses built with Next.js and Spring Boot.",
  manifest: "/manifest.json",
  icons: {
    icon: "/icon.svg",
    apple: "/icon-192x192-v2.png",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Dagbok",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#FF7518",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getUser();
  return (
    <html
      lang="en"
      className={`${roboto.variable} ${roboto.className} bg-[#1A1A1A]`}
    >
      <body className="min-h-screen overflow-x-hidden bg-gradient-to-br from-[#1A1A1A] to-[#2A2A2A] pb-20 md:pb-0">
        <Header user={user} />
        {children}
      </body>
    </html>
  );
}
