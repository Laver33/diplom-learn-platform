'use client'

import MainDescription from "@/components/mainDescription";
import MainStatistic from "@/components/mainStatistic";
import MainWelcome from "@/components/mainWelcome";
import { useRequireAuth } from "@/lib/auth-check";


const MainPage = () =>{
    useRequireAuth()
    

    return(
        <div>
            <MainWelcome />
            <MainDescription />
            <MainStatistic />

        </div>
    )
}

export default MainPage;