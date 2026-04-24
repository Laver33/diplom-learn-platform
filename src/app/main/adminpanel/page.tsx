'use client'

import MainDescription from "@/components/mainDescription";
import PagesTitle from "@/components/pagesTitle";
import { auth, db } from "@/lib/firebase/config";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";

interface iUser {
    email?: string,
    name?: string,
    surname?: string,
    role?: string,
    createdAt?: string
}

const adminPanel = () => {
    const titleAminPanel = 'Админ-панель'
    const descAdminPanel = 'Панель в которой вы сможете использовать ваши дополнительные возможности'

    const [userData, setUserData] = useState<iUser>()
    const [error, setError] = useState(false)

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            
            if (!user) {
                console.log('Не вошел (адм) ')
                setError(true) 
                return
            }
                    
            try {
                const docRef = doc(db, "users", user.uid)
                const docSnap = await getDoc(docRef) 
        
                if (docSnap.exists()) {
                    const userArray = docSnap.data()  
                    setUserData(userArray)
                    console.log("Данные пользователя загружены!:", userArray)
                    setError(false)
                } else {
                    setError(true) 
                    console.log('Документ пользователя не найден')
                }

            } catch ( error ) {
                setError(true)
            }
        })
        
        return () => unsubscribe()
    
    }, [])  

    if (error) return(console.log('ошибка (адм) '))

    const infoItems = [
        { label: 'Почта', value: userData?.email, icon: '📧', color: 'from-blue-500 to-blue-600' },
        { label: 'Имя', value: userData?.name, icon: '👤', color: 'from-purple-500 to-purple-600' },
        { label: 'Фамилия', value: userData?.surname, icon: '👥', color: 'from-pink-500 to-pink-600' },
        { label: 'Роль', value: userData?.role, icon: '🛡️', color: 'from-amber-500 to-orange-600' },
        { label: 'Создан', value: userData?.createdAt, icon: '📅', color: 'from-green-500 to-emerald-600' },
    ]

    return(
        <div>
            <PagesTitle title={titleAminPanel} />
            <MainDescription description={descAdminPanel} />

            <div className="user-information mt-8 p-8 rounded-3xl bg-white border border-slate-200 shadow-lg shadow-slate-200/50">
                <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 rounded-2xl bg-linear-to-br from-violet-500 to-purple-600 flex items-center justify-center">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                    </div>
                    <div>
                        <h2 className="font-bold text-2xl text-slate-800">Данные аккаунта</h2>
                        <p className="text-sm text-slate-500 mt-1">Информация о текущем пользователе</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {infoItems.map((item, index) => (
                        <div key={index} className="p-5 rounded-2xl bg-slate-50 border border-slate-200 hover:shadow-md hover:border-slate-300 transition-all duration-300 group">
                            <div className="flex items-center gap-3 mb-3">
                                <div className={`w-10 h-10 rounded-xl bg-linear-to-br ${item.color} flex items-center justify-center text-lg`}>
                                    {item.icon}
                                </div>
                                <span className="text-lg font-medium text-slate-500">{item.label}</span>
                            </div>
                            <p className="text-lg font-semibold text-slate-800 ml-13 pl-1">
                                {item.value || '—'}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default adminPanel;