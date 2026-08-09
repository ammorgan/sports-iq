import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sports IQ — Know More Than the Score",
  description: "A fast, competitive sports trivia challenge built for fans who know the game.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
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
