import Image, { StaticImageData } from "next/image";
import { useEffect, useState } from "react";

import mainIcon from '../../public/images/mainIcon.png'
import { useCustomStore } from "@/app/store/customStore";
import { useUserStore } from "@/app/store/userStore";


interface iStatCard {
    id: number,
    title: string
    icon: StaticImageData,
    bgColor: string,
    storeData: number
}



const MainStatistic = () => {

    // Стор
    const cardBgColor = useCustomStore((state) => state.card_statistic_color);
    const completedTest = useUserStore((state) => state.user_test_count);
    const startCourses = useUserStore((state) => state.user_courses_start_count);
    const completedCourses = useUserStore((state) => state.user_courses_completed_count);
    const userLvl = useUserStore((state) => state.user_lvl);

    const [widthScreen, setWidthScreen] = useState(1024);

    useEffect(() => {
    setWidthScreen(window.screen.width);
    }, []);

    const statsCardContant:iStatCard[] = [
        {id: 1, title: 'Пройдено тестов', icon: mainIcon, bgColor: '#b3fdfb', storeData: completedTest},
        {id: 2, title: 'Начатых курсов', icon: mainIcon, bgColor: '#eab2ff' , storeData: startCourses},
        {id: 3, title: 'Пройдено курсов', icon: mainIcon, bgColor: '#b5ffb4', storeData: completedCourses},
        {id: 4, title: 'Уровень', icon: mainIcon, bgColor: '#ffeeac',         storeData: userLvl},
    ]


    return(
        <div className="py-6 grid grid-cols-4 gap-6">
            {statsCardContant.map((res) => (
                <div key={res.id}  
                    style={{ width: widthScreen / 5.4, backgroundColor: cardBgColor }}
                    className="p-4 border rounded-2xl flex justify-between 
                    hover:shadow-md hover:duration-700"
                >
                    <div className="content-card">
                        <p>{res.title}</p>
                        <p>{res.storeData}</p>
                    </div>

                    <div
                        style={{background: res.bgColor}}
                        className="image-card rounded-xl"
                    >
                        <Image
                            className="m-3"
                            height={44}
                            width={44}
                            src={res.icon}
                            alt={res.title}
                        ></Image>
                    </div>
                </div>
            ))}
        
        </div>
    )
}

export default MainStatistic;

