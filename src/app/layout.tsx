import Footer from "@/components/sections/footer";
import { Toaster } from "@/components/ui/sonner";
import Provider from "@/context/provider";
import "@/styles/globals.css";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Whispr Room",
  description:
    "Create instant, disposable chat rooms for private conversations and file sharing. Rooms and messages are automatically deleted after a set time, ensuring privacy and a clutter-free experience",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`overflow-y-hidden ${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Provider>
          {children}
          <Footer />
        </Provider>
        <Toaster position="bottom-center" />
      </body>
    </html>
  );
}
