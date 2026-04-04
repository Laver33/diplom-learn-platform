'use client'
import SideBarMain from "@/components/SideBarMain";
import { SidebarProvider } from "@/components/ui/sidebar";
import { useRequireAuth } from "@/lib/auth-check";

export default function MainLayout ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) { 
    useRequireAuth()
    return(
        <SidebarProvider>
            <div className="flex min-h-screen">
                <SideBarMain/>
                <main className="flex-1 p-6"> 
                    {children}
                </main>
            </div>

        </SidebarProvider>
    )
}