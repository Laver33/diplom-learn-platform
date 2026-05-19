import Image, { StaticImageData } from "next/image";
import { useEffect, useState } from "react";
import { auth, db } from "@/lib/firebase/config";
import { doc, getDoc } from "firebase/firestore";

import mainIcon from '../../public/images/mainIcon.png'
import { useCustomStore } from "@/app/store/customStore";

interface iStatCard {
    id: number,
    title: string
    icon: StaticImageData,
    bgColor: string,
    storeData: number | string
    extraData?: string
}

const getLevelByScore = (score: number): { name: string; level: number } => {
    if (score >= 400) return { name: 'Специалист', level: 4 };
    if (score >= 300) return { name: 'Проверенный', level: 3 };
    if (score >= 200) return { name: 'Есть навыки', level: 2 };
    if (score >= 100) return { name: 'Новичок', level: 1 };
    return { name: 'Начинающий', level: 0 };
};

const MainStatistic = () => {
    const cardBgColor = useCustomStore((state) => state.card_statistic_color);
    
    const [completedTests, setCompletedTests] = useState(0);
    const [startedCourses, setStartedCourses] = useState(0);
    const [completedCourses, setCompletedCourses] = useState(0);
    const [userScore, setUserScore] = useState(0);
    const [userLevel, setUserLevel] = useState<string>('—');
    const [loading, setLoading] = useState(true);
    const [widthScreen, setWidthScreen] = useState(1024);

    useEffect(() => {
        setWidthScreen(window.screen.width);
        loadUserStatistics();
    }, []);

    const loadUserStatistics = async () => {
        const userId = auth.currentUser?.uid;
        if (!userId) {
            setLoading(false);
            return;
        }

        try {
            const userRef = doc(db, 'users', userId);
            const userSnap = await getDoc(userRef);
            const userData = userSnap.data();
            
            if (userData) {
                const score = userData.score || 0;
                setUserScore(score);
                
                const levelInfo = getLevelByScore(score);
                setUserLevel(levelInfo.name);

                const progress = userData.courseProgress || {};
                const completedTestsCount = Object.values(progress).filter(
                    (p: any) => p?.testPassed === true
                ).length;
                setCompletedTests(completedTestsCount);

                const startedCoursesCount = Object.keys(progress).length;
                setStartedCourses(startedCoursesCount);

                const completedCoursesCount = Object.values(progress).filter(
                    (p: any) => p?.testPassed === true
                ).length;
                setCompletedCourses(completedCoursesCount);
            }
        } catch (error) {
            console.error('Ошибка загрузки статистики:', error);
        } finally {
            setLoading(false);
        }
    };

    const statsCardContent: iStatCard[] = [
        { id: 1, title: 'Пройдено тестов', icon: mainIcon, bgColor: '#b3fdfb', storeData: loading ? '...' : completedTests },
        { id: 2, title: 'Начатых курсов', icon: mainIcon, bgColor: '#eab2ff', storeData: loading ? '...' : startedCourses },
        { id: 3, title: 'Пройдено курсов', icon: mainIcon, bgColor: '#b5ffb4', storeData: loading ? '...' : completedCourses },
        { id: 4, title: 'Уровень', icon: mainIcon, bgColor: '#ffeeac', storeData: loading ? '...' : userLevel, extraData: loading ? '...' : `${userScore} XP` },
    ];

    return (
        <div className="py-6 grid grid-cols-4 gap-6">
            {statsCardContent.map((res) => (
                <div 
                    key={res.id}  
                    style={{ width: widthScreen / 5.4, backgroundColor: cardBgColor }}
                    className="p-4 border rounded-2xl flex justify-between hover:shadow-md hover:duration-700"
                >
                    <div className="content-card">
                        <p className="text-sm text-gray-600">{res.title}</p>
                        <p className="text-2xl font-bold mt-1">{res.storeData}</p>
                        {res.extraData && (
                            <p className="text-xs text-gray-500 mt-1">{res.extraData}</p>
                        )}
                    </div>

                    <div
                        style={{ background: res.bgColor }}
                        className="image-card rounded-xl"
                    >
                        <Image
                            className="m-3"
                            height={44}
                            width={44}
                            src={res.icon}
                            alt={res.title}
                        />
                    </div>
                </div>
            ))}
        </div>
    );
};

export default MainStatistic;