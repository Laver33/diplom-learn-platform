'use client'

import MainDescription from "@/components/mainDescription";
import PagesTitle from "@/components/pagesTitle";
import { useState } from "react";
import { HeartCrack } from 'lucide-react';


const WishListPage = () => {
    const titleWishList = 'Избранное'
    const descrWishList = 'Здесь курсы, которые вы добавили в избранное.'

    const [haveCourse, useHaveCourse] = useState(false)
    const falseStyle = 'flex h-2/3 justify-center items-center text-2xl  gap-4'


    return(
        <>
            <PagesTitle title={titleWishList} />
            <MainDescription description={descrWishList} />

            
            {haveCourse == true ?  <p>true</p> : <div className={falseStyle}><HeartCrack className="h-5 w-5"/><p>Вы ничего не выбрали</p></div>} 
            
        </>
    )
}

export default WishListPage;