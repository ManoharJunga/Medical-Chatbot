import type React from "react";
import "@/app/globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { SidebarProvider } from "@/components/ui/sidebar"; 
import { DoctorSidebar } from "@/components/doctor-sidebar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Doctor Dashboard",
  description: "Medical professional dashboard for managing patients and appointments",
};
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="flex h-screen">
        <DoctorSidebar />
        <main className="flex-1 ml-64 p-4 bg-gray-100 dark:bg-gray-900 transition-all duration-300">
          {children}
        </main>
      </body>
    </html>
  );
}
