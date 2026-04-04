'use client'

import { useRequireAuth } from "@/lib/auth-check";


const MainPage = () =>{
    useRequireAuth()

    return(
        <>
         <p>Основная</p>
        
        
        </>
    )
}

export default MainPage;