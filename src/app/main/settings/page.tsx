'use client'
import { useUserStore } from "@/app/store/userStore";
import InputText from "@/components/inputText";
import MainDescription from "@/components/mainDescription";
import CoursesTitle from "@/components/pagesTitle";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import toast from "react-hot-toast";

// Иконки
import liveSettingsIcon from '../../../../public/images/liveSettings.png'
import colorsSettingsIcon from '../../../../public/images/colorsSettings.png'
import Image from "next/image";



const SettingPage = () => {
    const titleSettings = 'Настройки'
    const descSettings = 'Раздел в котором вы можете настроить ваше имя и кастомизиторовать интерфейс под ваш вкус.'

    //Хранилище 
    const { user_surname, user_name, updateUserName, updateUserSurname } = useUserStore();

    const [userName, setTempUserName] = useState('')
    const [userSurname, setTempUserSurname] = useState('')


    const saveUserInfo = async () => {

        // Проверка на пустоту
        if (userName.trim() == '' || userSurname.trim() == '') {
            toast.error('Есть пустое поле')
            return
        }

        await updateUserName(userName.trim())
        await updateUserSurname(userSurname.trim())

        
    }


    return(
        <div>
            <CoursesTitle title={titleSettings} />
            <MainDescription description={descSettings}/>

            <div className="first-wrap flex gap-10">

                {/* Пользовательские настройки */}
                <div className="w-1/1 profile-settings mt-8 p-6 border rounded-2xl bg-white">
                    <CoursesTitle title="Настройки пользователя"/>

                    <div className="data-user flex gap-5 mt-5">
                        <InputText 
                            value={userName} 
                            place={`Имя: ${user_name}`} 
                            titleField={"Имя"} 
                            setFunc={setTempUserName}
                        />
                        <InputText 
                            value={userSurname} 
                            place={`Фамилия: ${user_surname}`} 
                            titleField={`Фамилия`} 
                            setFunc={setTempUserSurname}
                        />
                    </div>

                    <div className="btn flex justify-end">
                        <Button 
                            className="p-4 mt-6 justify-end" 
                            onClick={saveUserInfo}
                        >
                            Сохранить</Button>
                    </div>
                </div>


                {/* Настройки данных пользователя */}
                <div className="style-settings w-1/1 mt-8 p-6 border rounded-2xl bg-white">
                    <CoursesTitle title="Настройки данных пользователя"/>

                    <div className="data-user flex gap-5 mt-5">
                        <InputText 
                            value={userName} 
                            place={`Имя: ${user_name}`} 
                            titleField={"Имя"} 
                            setFunc={setTempUserName}
                        />
                        <InputText 
                            value={userSurname} 
                            place={`Фамилия: ${user_surname}`} 
                            titleField={`Фамилия`} 
                            setFunc={setTempUserSurname}
                        />
                    </div>

                    <div className="btn flex justify-end">
                        <Button 
                            className="p-4 mt-6 justify-end" 
                            onClick={saveUserInfo}
                        >
                            Сохранить</Button>
                    </div>
                </div>

            </div>

            <div className="flex gap-10 mt-6">

                <div className="w-1/1 mt-4 p-6 border rounded-2xl bg-white">
                    <div className="title-card flex gap-2 h-6 items-center">
                        <Image
                            height={22}
                            width={22}
                            src={colorsSettingsIcon} 
                            alt="Цветовая палитра"
                        />
                        <h3>Цветовая палитра</h3>
                    </div>
                </div>


                <div className="w-1/1 mt-4 p-6 border rounded-2xl bg-white">
                    <div className="title-card flex gap-2 h-6 items-center">
                        <Image
                            height={22}
                            width={22}
                            src={liveSettingsIcon} 
                            alt="Примеры дизайнов"
                        />
                        <h3>Примеры</h3>
                    </div>                
                </div>

            </div>

        </div>
    )
}

export default SettingPage;

