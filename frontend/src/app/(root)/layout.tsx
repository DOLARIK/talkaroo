"use client";

import Navbar from "@/components/navbar";
import { AuthContextProvider } from "@/context/authContext";


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
        
        <body >
        <AuthContextProvider>
        <Navbar />
        {children}
        </AuthContextProvider>
        </body>
    </html>
  );
}
