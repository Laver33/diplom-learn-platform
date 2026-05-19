'use client'
import { useUserStore } from "@/app/store/userStore";
import InputText from "@/components/inputText";
import MainDescription from "@/components/mainDescription";
import CoursesTitle from "@/components/pagesTitle";
import { useState } from "react";
import toast from "react-hot-toast";
import { auth } from "@/lib/firebase/config";
import { updatePassword, EmailAuthProvider, reauthenticateWithCredential } from "firebase/auth";

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
    
    // Состояния для пароля
    const [currentPassword, setCurrentPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [passwordLoading, setPasswordLoading] = useState(false)

    const saveUserInfo = async () => {
        if (userName.trim() == '' || userSurname.trim() == '') {
            toast.error('Есть пустое поле')
            return
        }

        await updateUserEmail(userEmail.trim())
        await updateUserName(userName.trim())
        await updateUserSurname(userSurname.trim())
    }

    // Функция изменения пароля
    const changePassword = async () => {
        // Валидация
        if (!currentPassword || !newPassword || !confirmPassword) {
            toast.error('Заполните все поля пароля')
            return
        }

        if (newPassword.length < 6) {
            toast.error('Новый пароль должен быть минимум 6 символов')
            return
        }

        if (newPassword !== confirmPassword) {
            toast.error('Новый пароль и подтверждение не совпадают')
            return
        }

        setPasswordLoading(true)

        try {
            const user = auth.currentUser
            if (!user || !user.email) {
                toast.error('Пользователь не найден')
                return
            }

            // Повторная аутентификация перед сменой пароля
            const credential = EmailAuthProvider.credential(user.email, currentPassword)
            await reauthenticateWithCredential(user, credential)
            
            // Смена пароля
            await updatePassword(user, newPassword)
            
            toast.success('Пароль успешно изменен!')
            
            // Очистка полей
            setCurrentPassword('')
            setNewPassword('')
            setConfirmPassword('')
            
        } catch (error: any) {
            console.error('Ошибка смены пароля:', error)
            
            if (error.code === 'auth/wrong-password') {
                toast.error('Неверный текущий пароль')
            } else if (error.code === 'auth/weak-password') {
                toast.error('Пароль слишком слабый. Минимум 6 символов')
            } else if (error.code === 'auth/requires-recent-login') {
                toast.error('Для безопасности выйдите и войдите снова перед сменой пароля')
            } else {
                toast.error('Ошибка при смене пароля')
            }
        } finally {
            setPasswordLoading(false)
        }
    }

    return(
        <div>
            <CoursesTitle title={titleSettings} />
            <MainDescription description={descSettings}/>

            <div className="first-wrap flex gap-10 mt-6">

                {/* Настройки профиля */}
                <div className="w-1/2 profile-settings p-8 rounded-3xl bg-white border border-slate-200 shadow-lg shadow-slate-200/50 hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-500">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-xl bg-linear-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/25">
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-bold text-slate-800">Настройки профиля</h3>
                    </div>

                    <div className="data-user flex gap-5 mt-5">
                        <InputText 
                            maxLength={20}
                            value={userName} 
                            place={`Имя: ${user_name}`} 
                            titleField={"Имя"} 
                            setFunc={setTempUserName}
                        />
                        <InputText 
                            maxLength={20}
                            value={userSurname} 
                            place={`Фамилия: ${user_surname}`} 
                            titleField={"Фамилия"} 
                            setFunc={setTempUserSurname}
                        />
                    </div>

                    <div className="data-user flex gap-5 mt-5">
                        <InputText 
                            value={userEmail} 
                            place={`Почта: ${user_email}`} 
                            titleField={"Почта"} 
                            setFunc={setTempUserEmail}
                        />
                    </div>

                    <div className="settings-rules rounded-2xl mt-2 bg-red-100 p-2">
                        <p className="text-xs text-red-600 font-extrabold">Макс длина 20</p>
                    </div>

                    <div className="mt-6">
                        <SettingsSaveIcon 
                            funcBtn={saveUserInfo}
                            title={titleBtn} 
                        />
                    </div>
                </div>

                {/* Смена пароля */}
                <div className="w-1/2 p-8 rounded-3xl bg-white border border-slate-200 shadow-lg shadow-slate-200/50 hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-500">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-xl bg-linear-to-br from-red-500 to-red-600 flex items-center justify-center shadow-lg shadow-red-500/25">
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-bold text-slate-800">Смена пароля</h3>
                    </div>

                    <div className="space-y-4">
                        <InputText 
                            value={currentPassword} 
                            place={"Введите текущий пароль"} 
                            titleField={"Текущий пароль"} 
                            setFunc={setCurrentPassword}
                            type="password"
                        />
                        
                        <InputText 
                            value={newPassword} 
                            place={"Минимум 6 символов"} 
                            titleField={"Новый пароль"} 
                            setFunc={setNewPassword}
                            type="password"
                        />
                        
                        <InputText 
                            value={confirmPassword} 
                            place={"Подтвердите новый пароль"} 
                            titleField={"Подтверждение пароля"} 
                            setFunc={setConfirmPassword}
                            type="password"
                        />
                    </div>

                    <div className="settings-rules rounded-2xl mt-2 bg-amber-100 p-2">
                        <p className="text-xs text-amber-700 font-extrabold">⚠️ Пароль должен быть минимум 6 символов</p>
                    </div>

                    <div className="mt-6">
                        <button
                            onClick={changePassword}
                            disabled={passwordLoading}
                            className="w-full py-3 px-4 rounded-xl font-semibold text-white bg-linear-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {passwordLoading ? 'Изменение...' : 'Изменить пароль'}
                        </button>
                    </div>
                </div>

            </div>

            <div className="flex gap-10 mt-6">

                <div className="w-1/2 p-8 rounded-3xl bg-white border border-slate-200 shadow-lg shadow-slate-200/50 hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-500">
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

                <div className="w-1/2 p-8 rounded-3xl bg-white border border-slate-200 shadow-lg shadow-slate-200/50 hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-500">
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