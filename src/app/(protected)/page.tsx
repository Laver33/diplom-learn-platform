'use client'

import MainDescription from "@/components/mainDescription";
import MainStatistic from "@/components/mainStatistic";
import MainWelcome from "@/components/mainWelcome";
import { useRequireAuth } from "@/lib/auth-check";


const MainPage = () =>{
    useRequireAuth()
    
    const mainDescription = 'Рады вас снова видеть, какой замечательный день! Данная страница содержит информацию.'

    return(
        <div>
            <MainWelcome />
            <MainDescription description={mainDescription} />
            <MainStatistic />

        </div>
    )
}

export default MainPage;