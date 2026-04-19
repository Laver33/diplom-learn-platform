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

    return(
        <div>
            <PagesTitle title={titleAminPanel}  />
            <MainDescription description={descAdminPanel} />

            <div className="user-information border rounded-2xl p-4 mt-4">
                <h2 className="font-bold text-2xl">Данные аккаунта</h2>

                <ul className="flex gap-12 mt-4">
                    <li className="text-lg"><span className="font-bold">Почта:</span> {userData?.email}</li>
                    <li className="text-lg"><span className="font-bold">Имя:</span> {userData?.name}</li>
                    <li className="text-lg"><span className="font-bold">Фамилия:</span> {userData?.surname}</li>
                    <li className="text-lg"><span className="font-bold">Роль пользователя:</span> {userData?.role}</li>
                    <li className="text-lg"><span className="font-bold">Был создан:</span> {userData?.createdAt}</li>
                </ul>
            </div>
        </div>
    )
}

export default adminPanel;