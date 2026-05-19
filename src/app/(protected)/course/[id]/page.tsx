'use client'
import DynamicIcon from "@/components/DynamicIcon";
import { Button } from "@/components/ui/button";
import { useCourse } from "@/hooks/queries/useCourse";
import { auth, db } from "@/lib/firebase/config";
import { doc, updateDoc, arrayUnion, arrayRemove, getDoc } from "firebase/firestore";
import { Heart } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const CourseDetailPage = () => {

    const router = useRouter();
    const [hasTest, setHasTest] = useState(false);
    const [testCompleted, setTestCompleted] = useState(false);
    const [allLessonsCompleted, setAllLessonsCompleted] = useState(false);
    const [totalLessons, setTotalLessons] = useState(0);
    const [completedLessonsCount, setCompletedLessonsCount] = useState(0);
    const [testLoading, setTestLoading] = useState(true); // Добавил состояние загрузки теста

    const params = useParams()
    const id = params.id as string | undefined

    const { data: course, isLoading, error } = useCourse(id)

    const [isAddCourse, setIsAddCourse] = useState(false)
    const userId = auth.currentUser?.uid;

    useEffect(() => {
        const checkIfInCart = async () => {
            if (!userId || !id) return;
            
            const userRef = doc(db, 'users', userId);
            const userSnap = await getDoc(userRef);
            const coursesArr = userSnap.data()?.coursesArr || [];
            
            setIsAddCourse(coursesArr.includes(id));
        };
        
        checkIfInCart();
    }, [userId, id]);

    useEffect(() => {
        checkTestAndProgress();
    }, [id, userId, course]);

    async function addToCoursesArr() {
        try {
            if (!userId || !id) return;
            
            const userRef = doc(db, 'users', userId);
            
            await updateDoc(userRef, {
                coursesArr: arrayUnion(id),
            });
            
            setIsAddCourse(true);

            toast('Добавлен в избранное', {
                icon: '😉',
            });

        } catch(err){
            return console.log('Error: ', err)
        }
    }

    const checkTestAndProgress = async () => {
        if (!id) return;
        
        try {
            setTestLoading(true);
            
            // Проверяем наличие теста - ПРАВИЛЬНЫЙ ПУТЬ
            const testRef = doc(db, 'courses', id, 'tests', 'main');
            const testSnap = await getDoc(testRef);
            
            console.log('🔍 Проверка теста для курса:', id);
            console.log('📄 Тест существует:', testSnap.exists());
            
            if (testSnap.exists()) {
                const testData = testSnap.data();
                console.log('📊 Данные теста:', {
                    questionsCount: testData.questions?.length,
                    passingScore: testData.passingScore
                });
                setHasTest(true);
            } else {
                console.warn('⚠️ Тест не найден по пути:', `courses/${id}/tests/main`);
                setHasTest(false);
            }

            // Получаем количество уроков из курса
            if (course?.lessons) {
                setTotalLessons(course.lessons.length);
                console.log('📚 Количество уроков:', course.lessons.length);
            }

            // Проверяем прогресс пользователя
            if (userId) {
                const userRef = doc(db, 'users', userId);
                const userSnap = await getDoc(userRef);
                const userData = userSnap.data();
                const progress = userData?.courseProgress?.[id];
                
                console.log('📈 Прогресс пользователя:', progress);
                
                setTestCompleted(progress?.testCompleted || false);
                
                // Проверяем, все ли уроки пройдены
                const completedCount = progress?.completedLessons?.length || 0;
                setCompletedLessonsCount(completedCount);
                const lessonsCount = course?.lessons?.length || 0;
                const allCompleted = completedCount >= lessonsCount && lessonsCount > 0;
                setAllLessonsCompleted(allCompleted);
                
                console.log('✅ Все уроки пройдены:', allCompleted);
                console.log('🎯 Тест пройден:', progress?.testCompleted || false);
            } else {
                console.log('👤 Пользователь не авторизован');
            }
        } catch (error) {
            console.error('❌ Ошибка проверки теста:', error);
            toast.error('Ошибка проверки теста');
        } finally {
            setTestLoading(false);
        }
    };

    async function removeFromCoursesArr() {
        try {
            if (!userId || !id) return;
            
            const userRef = doc(db, 'users', userId);
            
            await updateDoc(userRef, {
                coursesArr: arrayRemove(id)
            });
            
            setIsAddCourse(false);

            toast('Убран из избранного', {
                icon: '🗑️',
            });

        } catch (err) {
            return console.log('Error: ', err)
        }
    }

    // Вычисляем процент прогресса
    const progressPercent = totalLessons > 0 
        ? Math.round((completedLessonsCount / totalLessons) * 100)
        : 0;

    if (isLoading || testLoading) {
        return <p>Загрузка...</p>
    }
    if (error) {
        return <p>Ошибка</p>
    }
    
    return(
        <div>
            <div 
                className="grid gap-6 p-12 rounded-sm w-full cursor-default"
                style={{ background: '#282b41' }}
            >
                <h2 
                    className="text-white text-4xl font-medium"
                >{course?.title}</h2>

                <p 
                    className="text-white font-light text-sm"
                >{course?.description}</p>

                <p
                    className="text-white"
                >Уровень: {course?.level} </p>
            </div>

            <div className="flex">

                <div className="left-content pt-6 grid gap-12 w-9/12 pr-5">

                    <div className="description">
                        <h2 className="text-2xl font-bold mb-2">Описание</h2>
                        <p className="text-base">{course?.introduction}</p>
                    </div>

                    <div className="technology">
                        <h2 className="text-2xl font-bold mb-2">Область изучения</h2>
                        <p className="text-base">{course?.writing_guidelines}</p>
                    </div>

                    <div className="icons flex gap-1">
                        <p>Иконки для описания раздела: </p>
                        {course?.icon_1 && <DynamicIcon name={course.icon_1} className="h-5 w-5 mr-2" />}
                        {course?.icon_2 && <DynamicIcon name={course.icon_2} className="h-5 w-5" />}
                    </div>
                </div>

                <div className="right-content grid gap-2 pt-4 w-3/12">

                    <div className="btns p-2 space-y-2">
                        <Button 
                            className="w-full h-14 bg-green-500 font-semibold text-base hover:bg-green-600 duration-700"
                            onClick={() => router.push(`/course/${id}/lessons`)}
                        >
                            Начать обучение
                        </Button>

                        {/* Кнопка теста - всегда показываем, если тест существует */}
                        {hasTest && (
                            <Button 
                                className="w-full h-14 font-semibold text-base"
                                variant={allLessonsCompleted && !testCompleted ? "default" : "outline"}
                                onClick={() => router.push(`/course/${id}/test`)}
                                disabled={!allLessonsCompleted || testCompleted}
                            >
                                {testCompleted ? '✅ Тест пройден' : 
                                 allLessonsCompleted ? '📝 Пройти тест' : `🔒 Завершите уроки (${completedLessonsCount}/${totalLessons})`}
                            </Button>
                        )}

                        {/* Если теста нет - показываем заглушку */}
                        {!hasTest && !testLoading && (
                            <Button 
                                className="w-full h-14 font-semibold text-base"
                                variant="outline"
                                disabled
                            >
                                📝 Тест скоро появится
                            </Button>
                        )}

                        <Button 
                            variant='outline'
                            className="w-full h-14 font-semibold text-base"
                            onClick={isAddCourse ? removeFromCoursesArr : addToCoursesArr}
                        >
                            <Heart 
                                color="black" 
                                className="h-4 w-4 mr-2"
                                fill={isAddCourse ? "red" : "none"}
                            />
                            {isAddCourse ? "В избранном" : "Хочу пройти"}
                        </Button>
                    </div>

                    <div className="bg-gray-300 p-4 rounded-sm">
                        <p className="font-bold">Доп информация</p>
                        <div className="mt-2">
                            <p>📚 Уроков: {totalLessons}</p>
                            <p>📊 Прогресс: {testCompleted ? '✅ 100% (тест пройден)' : allLessonsCompleted ? '🎓 100% (тест доступен)' : `${progressPercent}% (${completedLessonsCount}/${totalLessons})`}</p>
                            {!allLessonsCompleted && !testCompleted && totalLessons > 0 && (
                                <p className="text-xs text-gray-600 mt-2">
                                    ⚠️ Завершите все {totalLessons} уроков, чтобы открыть тест
                                </p>
                            )}
                            {allLessonsCompleted && !testCompleted && hasTest && (
                                <p className="text-xs text-green-600 mt-2">
                                    🎉 Все уроки пройдены! Теперь доступен тест
                                </p>
                            )}
                            {!hasTest && (
                                <p className="text-xs text-orange-600 mt-2">
                                    📝 Тест для этого курса еще не добавлен администратором
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CourseDetailPage;