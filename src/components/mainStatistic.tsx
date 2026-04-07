import Image, { StaticImageData } from "next/image";
import { useEffect, useState } from "react";

import mainIcon from '../../public/images/mainIcon.png'
import { useCustomStore } from "@/app/store/customStore";


interface iStatCard {
    id: number,
    title: string
    icon: StaticImageData,
    bgColor: string,
}



const MainStatistic = () => {

    // Стор
    const cardBgColor = useCustomStore((state) => state.card_statistic_color);


    const [widthScreen, setWidthScreen] = useState(1024);

    useEffect(() => {
    setWidthScreen(window.screen.width);
    }, []);

    const statsCardContant:iStatCard[] = [
        {id: 1, title: 'Пройдено тестов', icon: mainIcon, bgColor: '#b3fdfb'},
        {id: 2, title: 'Начатых курсов', icon: mainIcon, bgColor: '#eab2ff'},
        {id: 3, title: 'Пройдено курсов', icon: mainIcon, bgColor: '#b5ffb4'},
        {id: 4, title: 'Уровень', icon: mainIcon, bgColor: '#ffeeac'},
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
                        <p>numbers</p>
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

