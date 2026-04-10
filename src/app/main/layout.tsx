'use client'
import SideBarMain from "@/components/SideBarMain";
import { SidebarProvider } from "@/components/ui/sidebar";
import { useRequireAuth } from "@/lib/auth-check";
import { auth } from "@/lib/firebase/config";
import { useEffect } from "react";
import { useUserStore } from '@/app/store/userStore';

export default function MainLayout ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) { 
    useRequireAuth()
    const { fetchUserData } = useUserStore();

      useEffect(() => {
    // Проверка состояния
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        console.log('Пользователь авторизован, загружаем данные...');
        fetchUserData(); 
      } 
    });

    return () => unsubscribe();
  }, [fetchUserData]);
    return(
        <SidebarProvider>
            <div className="flex min-h-screen">
                <SideBarMain/>
                <main style={{ width: '100%'}} className=" p-8 bg-gray-100"> 
                    {children}
                </main>
            </div>

        </SidebarProvider>
    )
}