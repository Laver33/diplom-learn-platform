import { useEffect, useState } from "react";
import { auth, db } from "@/lib/firebase/config";
import { doc, getDoc } from "firebase/firestore";
import { useCustomStore } from "@/app/store/customStore";

import { 
  CheckCircle2,      
  BookOpen,          
  Trophy,            
  Sparkles,          
  TrendingUp         
} from 'lucide-react'

interface iStatCard {
    id: number;
    title: string;
    IconComponent: React.ElementType; 
    bgColor: string;
    storeData: number | string;
    extraData?: string;
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

        // Добавляем обработчик изменения размера окна
        const handleResize = () => setWidthScreen(window.innerWidth);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
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
                
                // Пройденные тесты (где testPassed === true)
                const completedTestsCount = Object.values(progress).filter(
                    (p: any) => p?.testPassed === true
                ).length;
                setCompletedTests(completedTestsCount);

                // Начатые курсы 
                const startedCoursesCount = Object.keys(progress).length;
                setStartedCourses(startedCoursesCount);

                // Пройденные курсы (все тесты в курсе пройдены 
                const completedCoursesCount = Object.values(progress).filter(
                    (p: any) => p?.courseCompleted === true || p?.testPassed === true
                ).length;
                setCompletedCourses(completedCoursesCount);
            }
        } catch (error) {
            console.error('Ошибка загрузки статистики:', error);
        } finally {
            setLoading(false);
        }
    };

    // Используем React-компоненты вместо StaticImageData
    const statsCardContent: iStatCard[] = [
        { 
            id: 1, 
            title: 'Пройдено тестов', 
            IconComponent: CheckCircle2, 
            bgColor: '#b3fdfb', 
            storeData: loading ? '...' : completedTests 
        },
        { 
            id: 2, 
            title: 'Начатых курсов', 
            IconComponent: BookOpen, 
            bgColor: '#eab2ff', 
            storeData: loading ? '...' : startedCourses 
        },
        { 
            id: 3, 
            title: 'Пройдено курсов', 
            IconComponent: Trophy, 
            bgColor: '#b5ffb4', 
            storeData: loading ? '...' : completedCourses 
        },
        { 
            id: 4, 
            title: 'Уровень', 
            IconComponent: Sparkles, 
            bgColor: '#ffeeac', 
            storeData: loading ? '...' : userLevel, 
            extraData: loading ? '...' : `${userScore} XP` 
        },
    ];

    // Адаптивная ширина
    const cardWidth = Math.min(widthScreen / 5.4, 320); 

    return (
        <div className="py-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {statsCardContent.map((card) => (
                <div 
                    key={card.id}  
                    style={{ backgroundColor: cardBgColor }}
                    className="p-4 border rounded-2xl flex justify-between items-center hover:shadow-md hover:shadow-slate-200 transition-all duration-300 hover:-translate-y-1"
                >
                    <div className="content-card flex-1">
                        <p className="text-sm text-gray-600">{card.title}</p>
                        <p className="text-2xl font-bold mt-1 text-slate-800">{card.storeData}</p>
                        {card.extraData && (
                            <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                                <TrendingUp className="w-3 h-3" />
                                {card.extraData}
                            </p>
                        )}
                    </div>

                    <div
                        style={{ background: card.bgColor }}
                        className="image-card rounded-xl p-3 ml-3"
                    >
                        <card.IconComponent 
                            className="w-7 h-7" 
                            style={{ color: getIconColor(card.id) }}
                            strokeWidth={1.75}
                        />
                    </div>
                </div>
            ))}
        </div>
    );
};

// Функция для определения цвета иконки
const getIconColor = (id: number): string => {
    switch(id) {
        case 1: return '#0d9488'; // teal-600
        case 2: return '#7c3aed'; // violet-600  
        case 3: return '#ea580c'; // orange-600
        case 4: return '#d97706'; // amber-600
        default: return '#475569';
    }
};

export default MainStatistic;