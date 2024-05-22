import type { Metadata } from "next";
import { montserrat } from "./ui/fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "AuthConnect",
  description: "Secure authentication app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={montserrat.className}>{children}</body>
    </html>
  );
}
