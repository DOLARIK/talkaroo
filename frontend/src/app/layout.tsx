import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { UserProvider } from '@auth0/nextjs-auth0/client';
import { Toaster } from "@/components/ui/sonner"



const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Talkaroo",
  description: "Your AI Confidant",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <UserProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <Toaster />
  
        <body className={inter.className}>{children}</body>
      </ThemeProvider>
      </UserProvider>
    </html>
  );
}
