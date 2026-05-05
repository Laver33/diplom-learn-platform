'use client'
import SideBarMain from "@/components/SideBarMain";
import { SidebarProvider } from "@/components/ui/sidebar";
import { useRequireAuth } from "@/lib/auth-check";
import { auth } from "@/lib/firebase/config";
import { useEffect } from "react";
import { useUserStore } from '@/app/store/userStore';



export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) { 
  useRequireAuth()
  const { fetchUserData } = useUserStore();

  useEffect(() => {
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
        <SideBarMain/>
        <main className="flex-1 p-8 bg-gray-100 overflow-visible">
          {children}
        </main>
    </SidebarProvider>
  )
}