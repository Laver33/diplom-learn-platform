'use client'
import { useUserStore } from "@/app/store/userStore";
import InputText from "@/components/inputText";
import CoursesTitle from "@/components/pagesTitle";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import toast from "react-hot-toast";


const SettingPage = () => {
    const titleSettings = 'Настройки'

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

            {/* Пользовательские настройки */}
            <div style={{ width: '100%'}} className="profile-settings mt-3 p-4 border">
                <CoursesTitle title="Настройки пользователя"/>

                <div className="data-user flex gap-3 mt-3">
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

                <Button 
                    className="p-3 mt-3" 
                    onClick={saveUserInfo}
                >
                    Сохранить</Button>
            </div>

            {/* Настройки стилей сайта */}
            <div className="style-settings">
                


            </div>

        </div>
    )
}

export default SettingPage;

