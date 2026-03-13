import type { Metadata } from "next";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { Providers } from "@/components/providers";
import "./globals.css";

export const metadata: Metadata = {
  title: "Classroom Redesigner",
  description:
    "Redesign your classroom with research, not guesswork. AI-powered, research-backed layout recommendations for educators.",
  metadataBase: new URL("https://classroom-redesigner.vercel.app"),
  openGraph: {
    title: "Classroom Redesigner",
    description:
      "Redesign your classroom with research, not guesswork. AI-powered, research-backed layout recommendations for educators.",
    siteName: "Classroom Redesigner",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Classroom Redesigner",
    description:
      "Redesign your classroom with research, not guesswork.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-stone-50 min-h-screen text-stone-900 antialiased flex flex-col">
        <Providers>
          <SiteHeader />
          <div className="flex-1">{children}</div>
          <SiteFooter />
        </Providers>
      </body>
    </html>
  );
}
