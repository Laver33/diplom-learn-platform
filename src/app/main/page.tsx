'use client'

import MainDescription from "@/components/mainDescription";
import MainWelcome from "@/components/mainWelcome";
import { useRequireAuth } from "@/lib/auth-check";


const MainPage = () =>{
    useRequireAuth()

    return(
        <div>
            <MainWelcome />
            <MainDescription />
        
        </div>
    )
}

export default MainPage;