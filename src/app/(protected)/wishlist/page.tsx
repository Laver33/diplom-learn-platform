'use client'

import MainDescription from "@/components/mainDescription";
import PagesTitle from "@/components/pagesTitle";
import CoursesWishList from "@/components/coursesWishList";
import { auth } from "@/lib/firebase/config";


const WishListPage = () => {
    const titleWishList = 'Избранное'
    const descrWishList = 'Здесь курсы, которые вы добавили в избранное.'

    const userId = auth.currentUser?.uid;

    


    return(
        <>
            <PagesTitle title={titleWishList} />
            <MainDescription description={descrWishList} />
            <CoursesWishList userId={userId}  /> 
            
        </>
    )
}

export default WishListPage;