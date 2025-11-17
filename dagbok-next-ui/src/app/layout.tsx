import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Dagbok cloud | Time Reporting & Work Log System!",
  description:
    "A modern, full-stack time reporting system for small businesses built with Next.js and Spring Boot.",
  icons: {
    icon: "/icon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
