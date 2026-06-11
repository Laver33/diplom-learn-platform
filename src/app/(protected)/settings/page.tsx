'use client'
import { useUserStore } from "@/app/store/userStore";
import InputText from "@/components/inputText";
import MainDescription from "@/components/mainDescription";
import CoursesTitle from "@/components/pagesTitle";
import { useState } from "react";
import toast from "react-hot-toast";
import { auth } from "@/lib/firebase/config";
import { updatePassword, EmailAuthProvider, reauthenticateWithCredential } from "firebase/auth";
import SettingsSaveIcon from "@/components/settingsSaveBtn";

const SettingPage = () => {
    const titleSettings = 'Настройки'
    const descSettings = 'Раздел в котором вы можете настроить ваше имя и поменять свой пароль.'
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

        try {
            // Обновляем имя и фамилию в сторе
            await updateUserName(userName.trim())
            await updateUserSurname(userSurname.trim())
            
            // Если email изменился, обновляем в Firebase (требует reauth)
            if (userEmail.trim() && userEmail.trim() !== user_email) {
                const user = auth.currentUser
                if (user) {
                    // Для смены email тоже нужна reauthentication
                    toast.error('Смена email требует подтверждения пароля')
                    // Можно добавить отдельную форму для смены email с паролем
                }
            }
            
            toast.success('Данные сохранены!')
            setTempUserName('')
            setTempUserSurname('')
            setTempUserEmail('')
            
        } catch (error) {
            toast.error('Ошибка при сохранении')
        }
    }

    // Функция изменения пароля
    const changePassword = async () => {
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

            const credential = EmailAuthProvider.credential(user.email, currentPassword)
            await reauthenticateWithCredential(user, credential)
            await updatePassword(user, newPassword)
            
            toast.success('Пароль успешно изменен!')
            
            setCurrentPassword('')
            setNewPassword('')
            setConfirmPassword('')
            
            // Предлагаем войти снова
            setTimeout(() => {
                toast.success('Пожалуйста, войдите с новым паролем')
                auth.signOut()
            }, 2000)
            
        } catch (error: any) {
            if (error.code === 'auth/wrong-password') {
                toast.error('Неверный текущий пароль')
            } else if (error.code === 'auth/weak-password') {
                toast.error('Пароль слишком слабый')
            } else if (error.code === 'auth/requires-recent-login') {
                toast.error('Выйдите и войдите снова для смены пароля')
                setTimeout(() => auth.signOut(), 1500)
            } else {
                toast.error('Ошибка при смене пароля')
            }
        } finally {
            setPasswordLoading(false)
        }
    }

    return (
        <div>
            <CoursesTitle title={titleSettings} />
            <MainDescription description={descSettings}/>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mt-6">
                {/* Настройки профиля */}
                <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-lg hover:shadow-xl transition-all duration-500">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-xl bg-linear-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg">
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-bold text-slate-800">Настройки профиля</h3>
                    </div>

                    <div className="space-y-4">
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
                        <InputText 
                            value={userEmail} 
                            place={`Почта: ${user_email}`} 
                            titleField={"Почта"} 
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

                {/* Смена пароля */}
                <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-lg hover:shadow-xl transition-all duration-500">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-xl bg-linear-to-br from-red-500 to-red-600 flex items-center justify-center shadow-lg">
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

                    <div className="mt-2 p-2 bg-amber-50 rounded-xl">
                        <p className="text-xs text-amber-700">
                            ⚠️ Пароль должен быть минимум 6 символов
                        </p>
                    </div>

                    <div className="mt-6">
                        <button
                            onClick={changePassword}
                            disabled={passwordLoading}
                            className="w-full py-3 px-4 rounded-xl font-semibold text-white bg-linear-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 transition-all duration-300 disabled:opacity-50"
                        >
                            {passwordLoading ? 'Изменение...' : 'Изменить пароль'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SettingPage;