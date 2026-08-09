import type { Metadata } from "next";
import { headers } from "next/headers";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host") ?? "sports-iq-arena.mandiemorgan19.chatgpt.site";
  const protocol = requestHeaders.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  const baseUrl = new URL(`${protocol}://${host}`);
  const socialImage = new URL("/og.png", baseUrl).toString();

  return {
    metadataBase: baseUrl,
    title: "Sports IQ — Learn the Game. See It Differently.",
    description: "Interactive sports learning paths that build rules, reads, responsibilities, strategy, and real game IQ.",
    icons: {
      icon: "/favicon.svg",
      shortcut: "/favicon.svg",
    },
    openGraph: {
      title: "Sports IQ",
      description: "Learn the game. See it differently.",
      type: "website",
      images: [{ url: socialImage, width: 1536, height: 1024, alt: "Sports IQ learning game" }],
    },
    twitter: {
      card: "summary_large_image",
      title: "Sports IQ",
      description: "Learn the game. See it differently.",
      images: [socialImage],
    },
  };
}

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
