import type { Metadata } from "next";
import "./globals.css";
import Header from "./components/Header";
import { Roboto } from "next/font/google";
import getUser from "@/app/actions/session";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "600"],
  variable: "--roboto",
});

export const metadata: Metadata = {
  title: "Dagbok cloud | Time Reporting & Work Log System",
  description:
    "A modern, full-stack time reporting system for small businesses built with Next.js and Spring Boot.",
  icons: {
    icon: "/icon.svg",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#1A1A1A",
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
      <body
        className={
          "bg-gradient-to-br from-[#1A1A1A] to-[#2A2A2A] overflow-x-hidden min-h-screen"
        }
      >
        <Header user={user} />
        {children}
      </body>
    </html>
  );
}
