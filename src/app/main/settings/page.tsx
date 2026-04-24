'use client'
import { useUserStore } from "@/app/store/userStore";
import InputText from "@/components/inputText";
import MainDescription from "@/components/mainDescription";
import CoursesTitle from "@/components/pagesTitle";
import { useState } from "react";
import toast from "react-hot-toast";

import liveSettingsIcon from '../../../../public/images/liveSettings.png'
import colorsSettingsIcon from '../../../../public/images/colorsSettings.png'
import Image from "next/image";
import SettingsSaveIcon from "@/components/settingsSaveBtn";

const SettingPage = () => {
    const titleSettings = 'Настройки'
    const descSettings = 'Раздел в котором вы можете настроить ваше имя и кастомизировать интерфейс под ваш вкус.'
    const titleBtn = 'Сохранить'

    const { user_surname, user_name, updateUserName, updateUserSurname, user_email, updateUserEmail } = useUserStore();

    const [userName, setTempUserName] = useState('')
    const [userSurname, setTempUserSurname] = useState('')
    const [userEmail, setTempUserEmail] = useState('')

    const saveUserInfo = async () => {
        if (userName.trim() == '' || userSurname.trim() == '') {
            toast.error('Есть пустое поле')
            return
        }

        await updateUserEmail(userEmail.trim())
        await updateUserName(userName.trim())
        await updateUserSurname(userSurname.trim())
    }

    return(
        <div>
            <CoursesTitle title={titleSettings} />
            <MainDescription description={descSettings}/>

            <div className="first-wrap flex gap-10 mt-6">

                {/* Пользовательские настройки */}
                <div className="w-1/1 profile-settings p-8 rounded-3xl bg-white border border-slate-200 shadow-lg shadow-slate-200/50 hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-500">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-xl bg-linear-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/25">
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-bold text-slate-800">Настройки пользователя</h3>
                    </div>

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

                    <div className="mt-6">
                        <SettingsSaveIcon 
                            funcBtn={saveUserInfo}
                            title={titleBtn} 
                        />
                    </div>
                </div>


                {/* Настройки данных пользователя */}
                <div className="style-settings w-1/1 p-8 rounded-3xl bg-white border border-slate-200 shadow-lg shadow-slate-200/50 hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-500">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-xl bg-linear-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-lg shadow-purple-500/25">
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-bold text-slate-800">Настройки данных пользователя</h3>
                    </div>

                    <div className="data-user flex gap-5 mt-5">
                        <InputText 
                            value={userName} 
                            place={`пуст`} 
                            titleField={"Пароль"} 
                            setFunc={setTempUserName}
                        />
                        <InputText 
                            value={userEmail} 
                            place={`Почта: ${user_email}`} 
                            titleField={`Почта`} 
                            setFunc={setTempUserEmail}
                        />
                    </div>

                    <div className="mt-6">
                        <SettingsSaveIcon 
                            funcBtn={saveUserInfo}
                            title={titleBtn} 
                        />
                    </div>
                </div>

            </div>

            <div className="flex gap-10 mt-6">

                <div className="w-1/1 p-8 rounded-3xl bg-white border border-slate-200 shadow-lg shadow-slate-200/50 hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-500">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-xl bg-linear-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-500/25">
                            <Image
                                height={20}
                                width={20}
                                src={colorsSettingsIcon} 
                                alt="Цветовая палитра"
                                className="brightness-0 invert"
                            />
                        </div>
                        <h3 className="text-xl font-bold text-slate-800">Цветовая палитра</h3>
                    </div>

                    <div className="flex gap-3 mb-6">
                        <p>тут будет выборка</p>
                    </div>

                    <SettingsSaveIcon 
                        funcBtn={saveUserInfo}
                        title={titleBtn} 
                    />
                </div>


                <div className="w-1/1 p-8 rounded-3xl bg-white border border-slate-200 shadow-lg shadow-slate-200/50 hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-500">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-xl bg-linear-to-r from-cyan-400 to-blue-500 flex items-center justify-center shadow-lg shadow-cyan-500/25">
                            <Image
                                height={20}
                                width={20}
                                src={liveSettingsIcon} 
                                alt="Примеры дизайнов"
                                className="brightness-0 invert"
                            />
                        </div>
                        <h3 className="text-xl font-bold text-slate-800">Примеры</h3>
                    </div>                
                </div>

            </div>

        </div>
    )
}

export default SettingPage;