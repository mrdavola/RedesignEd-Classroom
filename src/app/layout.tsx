import type { Metadata } from "next";
import { Providers } from "@/components/providers";
import "./globals.css";

export const metadata: Metadata = {
  title: "Classroom Redesigner",
  description: "Align physical space with pedagogical goals.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-stone-50 min-h-screen text-stone-900 antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
