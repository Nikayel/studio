import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "Diaspora Bridge — 100% Direct Donations for Afghan Girls' Education",
    template: "%s | Diaspora Bridge",
  },
  description:
    "Browse profiles, pick a person, donate. Every dollar is hand-delivered to Afghan families for girls' education. No middlemen, no overhead.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  openGraph: {
    title: "Diaspora Bridge",
    description: "100% of your donation goes directly to Afghan families for girls' education.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        {children}
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}
