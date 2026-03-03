import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Yahoo - login",
  description:
    "Sign in to access Yahoo Mail, Yahoo Finance, Yahoo News and more.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
