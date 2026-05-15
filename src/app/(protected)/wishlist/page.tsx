'use client'

import MainDescription from "@/components/mainDescription";
import PagesTitle from "@/components/pagesTitle";
import { useState } from "react";
import { HeartCrack } from 'lucide-react';
import CoursesWishList from "@/components/coursesWishList";
import { auth } from "@/lib/firebase/config";
import { useUserStore } from "@/app/store/userStore";


const WishListPage = () => {
    const titleWishList = 'Избранное'
    const descrWishList = 'Здесь курсы, которые вы добавили в избранное.'

    const falseStyle = 'flex h-2/3 justify-center items-center text-2xl  gap-4'
    const userId = auth.currentUser?.uid;

    const isLike = useUserStore((state) => state.isLikeCourse)
    


    return(
        <>
            <PagesTitle title={titleWishList} />
            <MainDescription description={descrWishList} />

            
            {isLike == true ?  <CoursesWishList userId={userId}  /> : <div className={falseStyle}><HeartCrack className="h-5 w-5"/><p>Вы ничего не выбрали</p></div>} 
            
        </>
    )
}

export default WishListPage;