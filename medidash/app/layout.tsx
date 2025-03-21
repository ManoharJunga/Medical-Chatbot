import type React from "react";
import "@/app/globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { DoctorSidebar } from "@/components/doctor-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Doctor Dashboard",
  description: "Medical professional dashboard for managing patients and appointments",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} flex h-screen overflow-hidden`}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <SidebarProvider defaultOpen>
            <div className="flex h-full w-full">
              {/* Sidebar with fixed width */}
              <div className="w-64 min-w-[16rem] bg-sidebar border-r border-border">
                <DoctorSidebar />
              </div>
              
              {/* Main content area */}
              <main className="flex-1 overflow-y-auto bg-background p-4">
                {children}
              </main>
            </div>
          </SidebarProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
