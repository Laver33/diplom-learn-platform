"use client"

import { useUserStore } from "@/app/store/userStore";
import { 
  Sidebar, 
  SidebarContent, 
  SidebarFooter, 
  SidebarHeader, 
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem
} from "./ui/sidebar";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import toast from "react-hot-toast";
import Image  from "next/image";
import Link from "next/link";
import { auth, db } from "@/lib/firebase/config";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

// Импорты иконок
import educateIcon from '../../public/images/educateIcon.png'
import cursesIcon from '../../public/images/cursesIcon.png'
import exitIcon from '../../public/images/exitIcon.png'
import settingsIcon from '../../public/images/settingsIcon.png'
import infoIcon from '../../public/images/infoIcon.png'
import mainIcon from '../../public/images/mainIcon.png'
import adminPanelIcon from '../../public/images/adminIcon.png'

const SideBarMain = () => {
    const userName = useUserStore((state) => state.user_name)
    const userSurname = useUserStore((state) => state.user_surname)

    // Админка
    const [userRole, setUserRole] = useState<string | null>(null);
    
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {   
            if (!user) {
                setUserRole(null);
                return;
            }

            try {
                const docRef = doc(db, "users", user.uid);
                const docSnap = await getDoc(docRef);
                
                if (docSnap.exists()) {
                    const userData = docSnap.data();
                    setUserRole(userData.role || null);
                  } else {
                    setUserRole(null);
                  }
                } catch (error) {
                  setUserRole(null);
                }
              });

        return () => unsubscribe(); 
    }, []);
  
    interface iCurs{
      id: number,
      title: string,
      icon?: any,
      nav: string,
    }

    const cursArr:iCurs[] = [
      {id: 1, title: 'Разработка', nav: '/courses/develop-course'},
      {id: 2, title: 'Экология', nav: '/courses/ekologiya-course'},
      {id: 3, title: 'Экономика', nav: '/courses/ekonomika-course'},
      {id: 4, title: 'Английский', nav: '/courses/eng-course'},
    ]

    const otherSidebarItems:iCurs[] = [
      {id: 1, title: 'Главная', nav: '/', icon: mainIcon},
      {id: 2, title: 'Прохожу', nav: '/dashboard', icon: cursesIcon},
      {id: 3, title: 'Настройки', nav: '/settings', icon: settingsIcon},
      {id: 4, title: 'Информация о проекте', nav: '/information', icon: infoIcon},
    ]

    function clickHandler(name: string){
      return () => {
        toast.success(`Переход на "${name}"`)
      }
    }

    function exitHandler (){
      return () => {
        toast.success('Выход завершен');
        auth.signOut();
      }
    }

    return(
    <Sidebar>
      {/* Хедер */}
      <SidebarHeader className="border-b border-slate-200/60 p-0 m-0 bg-linear-to-b from-white to-slate-50/50">
        <div className="sidebar-content flex items-center p-4 gap-3 cursor-default">
          <div className="relative">
            <div className="absolute inset-0 bg-linear-to-br from-blue-400/20 to-cyan-400/20 rounded-xl blur-sm" />
            <Image 
              className="relative p-2 rounded-xl bg-white shadow-md shadow-slate-200/50"
              height={48}
              width={48}
              src={educateIcon}
              alt="Иконка платформы"
            />
          </div>

          <div className="sidebar-name flex flex-col ml-1">
            <p className="font-semibold text-slate-800 text-sm leading-tight">{userName}</p>
            <p className="text-sm text-slate-500 leading-tight">{userSurname}</p>
          </div>
        </div>
      </SidebarHeader>

      {/* Основной контент */}
      <SidebarContent className="px-3 py-4">

        {/* Контент курсов */}
        <SidebarMenuItem className="mb-2">
          <Collapsible>
            <CollapsibleTrigger asChild>
              <SidebarMenuButton className="cursor-pointer p-3 font-semibold text-slate-700 rounded-xl
                hover:bg-slate-100 hover:text-slate-900 transition-all duration-200
                data-[state=open]:bg-slate-100 data-[state=open]:text-slate-900
                group flex items-center gap-3"
              >
                <div className="w-9 h-9 rounded-lg bg-linear-to-br from-amber-400 to-orange-500 
                  flex items-center justify-center shadow-md shadow-amber-500/20
                  group-hover:shadow-lg group-hover:shadow-amber-500/30 transition-all duration-200"
                >
                  <Image 
                    height={18}
                    width={18}
                    src={cursesIcon} 
                    alt="курсы"
                    className="brightness-0 invert"
                  />
                </div>
                <span>Виды курсов</span>
                <svg className="ml-auto w-4 h-4 text-slate-400 transition-transform duration-200 group-data-[state=open]:rotate-180" 
                  fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </SidebarMenuButton>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <SidebarMenuSub className="mt-1 ml-4 border-l-2 border-slate-200 pl-4">
                {cursArr.map((res) => (
                  <Link
                    key={res.id}
                    href={res.nav}
                  >
                    <SidebarMenuSubItem 
                      onClick={clickHandler(res.title)}
                      className="py-2.5 px-3 text-sm text-slate-600 rounded-lg
                        hover:bg-slate-100 hover:text-slate-900 transition-all duration-200
                        cursor-pointer flex items-center gap-2"
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-slate-400 group-hover:bg-slate-700 transition-colors" />
                      {res.title}
                    </SidebarMenuSubItem>
                  </Link>
                ))}
              </SidebarMenuSub>
            </CollapsibleContent>
          </Collapsible>
        </SidebarMenuItem>

        {/* Второе меню */}
        <SidebarMenuItem className="space-y-1">
          {otherSidebarItems.map((res) => (
            <Link
              key={res.id}
              href={res.nav}
            >
              <SidebarMenuButton 
                onClick={clickHandler(res.title)}
                className="cursor-pointer p-3 font-semibold text-slate-700 rounded-xl
                  hover:bg-slate-100 hover:text-slate-900 transition-all duration-200
                  w-full flex items-center gap-3 group mt-3"
              >
                <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center
                  group-hover:bg-white group-hover:shadow-md transition-all duration-200"
                >
                  <Image 
                    className="p-0.5 opacity-70 group-hover:opacity-100 transition-opacity"
                    height={26}
                    width={26}
                    src={res.icon} 
                    alt={res.title}
                  />
                </div>
                <span>{res.title}</span>
              </SidebarMenuButton>
            </Link>
          ))}
        </SidebarMenuItem>

        {/* Админка */}
        {userRole === 'admin' ? 
          <SidebarMenuItem className="mt-2 pt-3 border-t border-slate-200/60">
            <Link href={'/adminpanel'}>
              <SidebarMenuButton className="cursor-pointer p-5 font-semibold rounded-xl
                bg-linear-to-r from-violet-500/10 to-purple-500/10 text-violet-700
                hover:from-violet-500/20 hover:to-purple-500/20 transition-all duration-500
                w-full flex items-center gap-3 group border border-violet-200/50
                hover:border-violet-300/50 hover:shadow-md hover:shadow-violet-500/10"
              >
                <div className="w-9 h-9 rounded-lg bg-linear-to-br from-violet-500 to-purple-600 
                  flex items-center justify-center shadow-md shadow-violet-500/25
                  group-hover:shadow-lg group-hover:shadow-violet-500/40 transition-all duration-500"
                >
                  <Image 
                    className="p-0.5 brightness-0 invert"
                    height={26}
                    width={26}
                    src={adminPanelIcon} 
                    alt="админка" 
                  />
                </div>
                <span>Админ-панель</span>
                <div className="ml-auto w-2 h-2 rounded-full bg-violet-400 animate-pulse" />
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem> 
        : null}

      </SidebarContent>

      {/* Футер */}
      <SidebarFooter className="border-t border-slate-200/60 p-4 bg-linear-to-t from-slate-50/80 to-white">
        <button 
          onClick={exitHandler()}
          className="w-full flex items-center gap-3 p-3 rounded-xl
            hover:bg-red-50 transition-all duration-200 group"
        >
          <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center
            group-hover:bg-red-100 group-hover:shadow-md transition-all duration-200"
          >
            <Image 
              className="p-1 opacity-60 group-hover:opacity-100 transition-opacity"
              height={36}
              width={36}
              src={exitIcon} 
              alt="Выход"
            />
          </div>
          <div className="text-left">
            <p className="text-sm font-medium text-slate-600 group-hover:text-red-600 transition-colors">Выйти</p>
            <p className="text-xs text-slate-400">Выйти с аккаунта</p>
          </div>
          <svg className="ml-auto w-4 h-4 text-slate-400 group-hover:text-red-500 group-hover:translate-x-1 transition-all" 
            fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
        </button>
      </SidebarFooter>
    </Sidebar>
    )
}

export default SideBarMain;