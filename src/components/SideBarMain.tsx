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

// Импорты иконок
import educateIcon from '../../public/images/educateIcon.png'
import cursesIcon from '../../public/images/cursesIcon.png'
import exitIcon from '../../public/images/exitIcon.png'
import settingsIcon from '../../public/images/settingsIcon.png'
import infoIcon from '../../public/images/infoIcon.png'
import mainIcon from '../../public/images/mainIcon.png'
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";





const SideBarMain = () => {
    const userName = useUserStore((state) => state.user_name)
    const userSurname = useUserStore((state) => state.user_surname)

    // Админка
    const [userRole, setUserRole] = useState<string | null>(null);
    
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            console.log("Auth state changed:", user?.uid || "no user");
            
            // обязательно проверка на пустоту 
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
                    // console.log("Роль: ", userData.role);
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

    // Данные

    const cursArr:iCurs[] = [
      {id: 1, title: 'Разработка', nav: '/main/courses/develop-course'},
      {id: 2, title: 'Экология', nav: '/main/courses/ekologiya-course'},
      {id: 3, title: 'Экономика', nav: '/main/courses/ekonomika-course'},
      {id: 4, title: 'Английский', nav: '/main/courses/eng-course'},
    ]

    const otherSidebarItems:iCurs[] = [
      {id: 1, title: 'Главная', nav: '/main', icon: mainIcon},
      {id: 2, title: 'Прохожу', nav: '/main/courses', icon: cursesIcon},
      {id: 3, title: 'Настройки', nav: '/main/settings', icon: settingsIcon},
      {id: 4, title: 'Информация о проекте', nav: '/main/courses', icon: infoIcon},
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
        window.location.href = '/';
      }
    }

    return(
    <Sidebar>
      {/* Хедер (Иконка и никнеймы) */}
      <SidebarHeader className="border-b p-0 m-0">
        <div className="sidebar-content flex p-4 cursor-default">

          <Image 
            className="ml-2 shadow-xl/30 p-2 rounded"
            height={48}
            width={48}
            src={educateIcon}
            alt="Иконка платформы"
          />

          <div className="sidebar-name flex gap-1 items-center ml-4">
            <p>{userName}</p>
            <p>{userSurname}</p>
          </div>

        </div>
      </SidebarHeader>

      {/* Основной контент с курсами и тд*/}
      <SidebarContent>

        {/* Контент курсов */}
        <SidebarMenuItem>
          <Collapsible>
            <CollapsibleTrigger asChild>
              <SidebarMenuButton className="cursor-pointer p-6 font-bold" >
                <Image 
                  height={28}
                  width={28}
                  src={cursesIcon} 
                  alt="курсы"
                />
                <p>Виды курсов</p>
              </SidebarMenuButton>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <SidebarMenuSub>
                {cursArr.map((res) => (
                  <Link
                    key={res.id}
                    href={res.nav}
                  >
                    <SidebarMenuSubItem onClick={clickHandler(res.title)}>{res.title}</SidebarMenuSubItem>
                  </Link>
                ))}
              </SidebarMenuSub>
            </CollapsibleContent>
          </Collapsible>
        </SidebarMenuItem>

        {/* Второе меню (без выпадашки) */}
        <SidebarMenuItem>
          {otherSidebarItems.map((res) => (
            <Link
              key={res.id}
              href={res.nav}
            >
              <SidebarMenuButton className="cursor-pointer p-6 font-bold" onClick={clickHandler(res.title)}>
                <Image 
                  className="p-1 border-2 rounded-sm shadow-xl"
                  height={36}
                  width={36}
                  src={res.icon} 
                  alt="курсы" 
                />
                <p>{res.title}</p>
              </SidebarMenuButton>
            </Link>
            ))}
        </SidebarMenuItem>

        {/* Админка */}
        {userRole === 'admin' ? <SidebarMenuItem>
          <Link
            href={'/main/adminpanel'}
          >
            <SidebarMenuButton className="cursor-pointer p-6 font-bold">
              <p>Админ-панель</p>
            </SidebarMenuButton>
          </Link>
        </SidebarMenuItem> : null}


      </SidebarContent>

      {/* Футер (выход из аккаунта и переход на старт) */}
      <SidebarFooter>
        <Image 
          className="p-3 border-2 rounded-sm shadow-xl"
          height={48}
          width={48}
          src={exitIcon} 
          alt="курсы" 
          onClick={exitHandler()}
        />
      </SidebarFooter>
    </Sidebar>
    )
}

export default SideBarMain;
