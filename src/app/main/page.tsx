'use client'

import { useRequireAuth } from "@/lib/auth-check";


const MainPage = () =>{
    useRequireAuth()

    return(
        <>
         <p>Основной контент</p>
        
        
        </>
    )
}

export default MainPage;