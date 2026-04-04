"use client"

import { useUserStore } from "@/app/store/userStore";
import { 
  Sidebar, 
  SidebarContent, 
  SidebarHeader, 
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem
} from "./ui/sidebar";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import toast from "react-hot-toast";
import Image, { StaticImageData } from "next/image";

// Импорты иконок
import educateIcon from '../../public/images/educateIcon.png'
import cursesIcon from '../../public/images/cursesIcon.png'

const SideBarMain = () => {

    const userName = useUserStore((state) => state.user_name)
    const userSurname = useUserStore((state) => state.user_surname)

    function test (){
      toast.success('click')
    }

    interface iCurs{
      id: number,
      title: string,
      icon?: any,
      nav: () => void,
    }

    const cursArr:iCurs[] = [
      {id: 1, title: 'Разработка', nav: test},
      {id: 2, title: 'Экология', nav: test},
      {id: 3, title: 'Экономика', nav: test},
      {id: 4, title: 'Английский', nav: test},
    ]

    const otherSidebarItems:iCurs[] = [
      {id: 1, title: 'Прохожу', nav: test, icon: cursesIcon},
      {id: 2, title: 'Контакты', nav: test, icon: cursesIcon},
      {id: 3, title: 'Настройки', nav: test, icon: cursesIcon},
      {id: 4, title: 'Информация о проекте', nav: test, icon: cursesIcon},
    ]

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
              <SidebarMenuButton className="cursor-pointer p-6 font-bold" onClick={test}>
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
                  <SidebarMenuSubItem key={res.id} onClick={res.nav}>{res.title}</SidebarMenuSubItem>
                ))}
              </SidebarMenuSub>
            </CollapsibleContent>
          </Collapsible>
        </SidebarMenuItem>

        {/* Второе меню (без выпадашки) */}
        <SidebarMenuItem>
          {otherSidebarItems.map((res) => (
              <SidebarMenuButton key={res.id} className="cursor-pointer p-6 font-bold" onClick={res.nav}>
                <Image 
                  height={28}
                  width={28}
                  src={res.icon} 
                  alt="курсы" 
                />
                <p>{res.title}</p>
              </SidebarMenuButton>
            ))}
        </SidebarMenuItem>

      </SidebarContent>
    </Sidebar>
    )
}

export default SideBarMain;