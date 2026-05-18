'use client'

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { db, auth } from "@/lib/firebase/config";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, Lock, PlayCircle, ArrowLeft } from "lucide-react";
import { toast } from "react-hot-toast";

const CourseLessonsPage = () => {
    const params = useParams();
    const router = useRouter();
    const courseId = params.id as string;
    
    const [course, setCourse] = useState<any>(null);
    const [currentLesson, setCurrentLesson] = useState(0);
    const [completedLessons, setCompletedLessons] = useState<number[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (courseId) {
            loadCourseAndProgress();
        }
    }, [courseId]);

    const loadCourseAndProgress = async () => {
        try {
            setLoading(true);
            
            // Старт
            const courseRef = doc(db, 'courses', courseId);
            const courseSnap = await getDoc(courseRef);
            
            if (!courseSnap.exists()) {
                toast.error('Курс не найден');
                router.push('/courses');
                return;
            }
            
            // Обход от TS
            const courseData = { id: courseSnap.id, ...courseSnap.data() } as any;
            

            if (!courseData.lessons || courseData.lessons.length === 0) {
                toast.error('Уроки не найдены для этого курса');
                router.push(`/course/${courseId}`);
                return;
            }
            
            setCourse(courseData);

            // Загрузка прогресса пользователя
            const userId = auth.currentUser?.uid;
            if (userId) {
                const userRef = doc(db, 'users', userId);
                const userSnap = await getDoc(userRef);
                const userData = userSnap.data() as any;
                const progress = userData?.courseProgress?.[courseId];
                
                if (progress?.completedLessons) {
                    setCompletedLessons(progress.completedLessons);
                    setCurrentLesson(progress.completedLessons.length);
                }
            }
        } catch (error) {
            console.error('Ошибка загрузки:', error);
            toast.error('Ошибка загрузки курса');
        } finally {
            setLoading(false);
        }
    };

    const completeLesson = async () => {
        if (!course || !course.lessons) return;
        
        const newCompleted = [...completedLessons, currentLesson];
        setCompletedLessons(newCompleted);

        // Сохраняем прогресс
        const userId = auth.currentUser?.uid;
        if (userId) {
            try {
                const userRef = doc(db, 'users', userId);
                await updateDoc(userRef, {
                    [`courseProgress.${courseId}`]: {
                        completedLessons: newCompleted,
                        lastLesson: currentLesson,
                        updatedAt: new Date().toISOString()
                    }
                });
            } catch (error) {
                console.error('Ошибка сохранения прогресса:', error);
            }
        }

        if (currentLesson < course.lessons.length - 1) {
            setCurrentLesson(currentLesson + 1);
            toast.success('Урок завершен! Переход к следующему уроку');
        } else {
            toast.success('🎉 Поздравляем! Вы завершили все уроки! Теперь можно пройти тест');
        }
    };

    // Показываем загрузку
    if (loading) {
        return (
            <div className="flex justify-center items-center h-96">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Загрузка курса...</p>
                </div>
            </div>
        );
    }

    // Если курс не загружен
    if (!course) {
        return (
            <div className="flex justify-center items-center h-96">
                <div className="text-center">
                    <p className="text-gray-600 mb-4">Курс не найден</p>
                    <Button onClick={() => router.push('/courses')}>
                        Вернуться к курсам
                    </Button>
                </div>
            </div>
        );
    }

    // Если нет уроков
    if (!course.lessons || course.lessons.length === 0) {
        return (
            <div className="flex justify-center items-center h-96">
                <div className="text-center">
                    <p className="text-gray-600 mb-4">Уроки еще не добавлены</p>
                    <Button onClick={() => router.push(`/course/${courseId}`)}>
                        Вернуться к курсу
                    </Button>
                </div>
            </div>
        );
    }

    // Безопасная проверка текущего урока
    const currentLessonData = course.lessons[currentLesson];
    if (!currentLessonData) {
        return (
            <div className="flex justify-center items-center h-96">
                <div className="text-center">
                    <p className="text-gray-600 mb-4">Ошибка загрузки урока</p>
                    <Button onClick={() => router.push(`/course/${courseId}`)}>
                        Вернуться к курсу
                    </Button>
                </div>
            </div>
        );
    }

    const progress = (completedLessons.length / course.lessons.length) * 100;

    return (
        <div className="max-w-6xl mx-auto p-6">
            {/* Кнопка назад */}
            <Button
                variant="ghost"
                onClick={() => router.push(`/course/${courseId}`)}
                className="mb-4"
            >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Назад к курсу
            </Button>

            <div className="mb-6">
                <h1 className="text-2xl font-bold mb-2">{course.title}</h1>
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                    <span>Прогресс: {completedLessons.length} из {course.lessons.length} уроков</span>
                    <span>{Math.round(progress)}%</span>
                </div>
                <Progress value={progress} className="h-2" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Список уроков */}
                <div className="md:col-span-1">
                    <Card>
                        <CardContent className="pt-6">
                            <h3 className="font-semibold mb-4">Уроки курса</h3>
                            <div className="space-y-2 max-h-125 overflow-y-auto">
                                {course.lessons.map((lesson: any, idx: number) => (
                                    <button
                                        key={idx}
                                        onClick={() => setCurrentLesson(idx)}
                                        className={`w-full text-left p-3 rounded-lg transition-all flex items-center gap-3 ${
                                            currentLesson === idx 
                                                ? 'bg-blue-50 border border-blue-200' 
                                                : 'hover:bg-gray-50'
                                        }`}
                                    >
                                        {completedLessons.includes(idx) ? (
                                            <CheckCircle className="w-5 h-5 text-green-500 shrink-0" />
                                        ) : idx === currentLesson ? (
                                            <PlayCircle className="w-5 h-5 text-blue-500 shrink-0" />
                                        ) : (
                                            <Lock className="w-5 h-5 text-gray-400 shrink-0" />
                                        )}
                                        <span className={`text-sm truncate ${
                                            currentLesson === idx ? 'font-medium' : ''
                                        }`}>
                                            Урок {idx + 1}: {lesson.title || 'Без названия'}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Содержание урока */}
                <div className="md:col-span-2">
                    <Card>
                        <CardContent className="pt-6">
                            <h2 className="text-xl font-bold mb-4">
                                Урок {currentLesson + 1}: {currentLessonData.title || 'Без названия'}
                            </h2>
                            <div className="prose max-w-none mb-6 min-h-75">
                                <p className="text-gray-700 whitespace-pre-wrap">
                                    {currentLessonData.content || 'Контент урока пока не добавлен'}
                                </p>
                            </div>
                            
                            <div className="flex justify-between mt-6">
                                <Button
                                    onClick={() => setCurrentLesson(Math.max(0, currentLesson - 1))}
                                    disabled={currentLesson === 0}
                                    variant="outline"
                                >
                                    ← Предыдущий урок
                                </Button>
                                
                                {!completedLessons.includes(currentLesson) && (
                                    <Button
                                        onClick={completeLesson}
                                        className="bg-green-600 hover:bg-green-700"
                                    >
                                        ✅ Завершить урок
                                    </Button>
                                )}
                                
                                {completedLessons.includes(currentLesson) && 
                                 currentLesson < course.lessons.length - 1 && (
                                    <Button
                                        onClick={() => setCurrentLesson(currentLesson + 1)}
                                    >
                                        Следующий урок →
                                    </Button>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default CourseLessonsPage;