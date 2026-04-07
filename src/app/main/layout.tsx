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
                <main className=" p-8 bg-gray-100"> 
                    {children}
                </main>
            </div>

        </SidebarProvider>
    )
}