import type { Metadata } from "next";
import "./globals.css";

const siteUrl = new URL("https://sports-iq-arena.mandiemorgan19.chatgpt.site");

export const metadata: Metadata = {
  metadataBase: siteUrl,
  title: "RepQuest — Learn the Game. Build Your IQ.",
  description: "Interactive sports learning paths that build rules, reads, responsibilities, strategy, and real game IQ.",
  icons: {
    icon: "/repquest-logo.png",
    shortcut: "/repquest-logo.png",
  },
  openGraph: {
    title: "RepQuest",
    description: "Learn the game. See it differently.",
    type: "website",
    images: [{ url: "/repquest-logo.png", width: 1254, height: 1254, alt: "RepQuest sports learning game logo" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "RepQuest",
    description: "Learn the game. See it differently.",
    images: ["/repquest-logo.png"],
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
