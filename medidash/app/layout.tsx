import type React from "react";
import "@/app/globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { SidebarWrapper } from "@/components/SidebarWrapper"; // Import new sidebar component

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Doctor Dashboard",
  description: "Medical professional dashboard for managing patients and appointments",
};
import { SidebarProvider } from "@/components/ui/sidebar"; // Import SidebarProvider

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="flex h-screen">
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
         
                <main className="flex-1 overflow-y-auto bg-background p-4">
                  {children}
                </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
