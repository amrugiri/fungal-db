import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Header } from "@/components/layout/Header";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Fungal Mycoprotein Database",
    template: "%s | Fungal Mycoprotein DB",
  },
  description:
    "Alternative protein database for fungal mycoprotein species — meat analog potential, sensory profiles, protein quality, commercial use, and interactive 3D morphology.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased light`}
      style={{ colorScheme: "light" }}
    >
      <body className="min-h-full flex flex-col bg-white text-black">
        <Header />
        <main className="flex-1">{children}</main>
      </body>
    </html>
  );
}
