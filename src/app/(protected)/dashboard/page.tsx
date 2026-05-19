'use client'

import { useState, useEffect } from "react";
import { auth, db } from "@/lib/firebase/config";
import { doc, getDoc, collection, getDocs, query, where } from "firebase/firestore";
import MainDescription from "@/components/mainDescription";
import PagesTitle from "@/components/pagesTitle";
import { Card, CardHeader, CardTitle, CardDescription, CardFooter, CardAction } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { BookOpen, Clock, CheckCircle, PlayCircle } from "lucide-react";

const DashboardPage = () => {
    const titleDashboard = 'Прохожу';
    const descDashboard = 'Здесь все курсы, которые вы прошли или проходите в данный момент';
    
    const [inProgressCourses, setInProgressCourses] = useState<any[]>([]);
    const [completedCourses, setCompletedCourses] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadUserCourses();
    }, []);

    const loadUserCourses = async () => {
        const userId = auth.currentUser?.uid;
        if (!userId) {
            setLoading(false);
            return;
        }

        try {
            // Данные польз
            const userRef = doc(db, 'users', userId);
            const userSnap = await getDoc(userRef);
            const userData = userSnap.data();
            
            // Все что начинал
            const courseProgress = userData?.courseProgress || {};
            const courseIds = Object.keys(courseProgress);
            
            if (courseIds.length === 0) {
                setLoading(false);
                return;
            }

            // Информация о курсах
            const coursesRef = collection(db, 'courses');
            const q = query(coursesRef, where('__name__', 'in', courseIds));
            const coursesSnap = await getDocs(q);
            
            const allCourses = coursesSnap.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));

            // Разделяем на пройденные
            const completed = [];
            const inProgress = [];

            for (const course of allCourses) {
                const progress = courseProgress[course.id];
                if (progress?.testPassed === true) {
                    completed.push(course);
                } else {
                    inProgress.push(course);
                }
            }

            setCompletedCourses(completed);
            setInProgressCourses(inProgress);
        } catch (error) {
            console.error('Ошибка загрузки:', error);
        } finally {
            setLoading(false);
        }
    };

    // Получение прогресса для карточки
    const getProgressForCourse = (courseId: string) => {
        // Здесь можно добавить логику для отображения прогресса
        // Пока просто заглушка
        return null;
    };

    if (loading) {
        return (
            <div>
                <PagesTitle title={titleDashboard} />
                <MainDescription description={descDashboard} />
                <div className="flex justify-center items-center h-64">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                        <p className="text-gray-600">Загрузка курсов...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div>
            <PagesTitle title={titleDashboard} />
            <MainDescription description={descDashboard} />

            {/* Курсы в процессе */}
            <div className="py-4">
                <h2 className="text-2xl mb-4 flex items-center gap-2">
                    <PlayCircle className="w-6 h-6 text-blue-500" />
                    В процессе
                </h2>

                {inProgressCourses.length === 0 ? (
                    <div className="bg-gray-50 rounded-xl p-8 text-center border border-gray-200">
                        <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                        <p className="text-gray-500">У вас нет курсов в процессе</p>
                        <Link href="/courses">
                            <Button className="mt-3">Начать обучение</Button>
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                        {inProgressCourses.map((course) => (
                            <Card key={course.id} className="hover:shadow-xl transition-all duration-300">
                                <img
                                    src={course.image || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800"}
                                    alt={course.title}
                                    className="relative z-20 aspect-video w-full object-cover brightness-90 rounded-t-lg"
                                />
                                <CardHeader className="h-32 cursor-default">
                                    <CardAction className="grid gap-3">
                                        <Badge className="font-medium bg-blue-100 text-blue-700 hover:bg-blue-100">
                                            {course.level || "Начинающий"}
                                        </Badge>                 
                                        <Badge variant="secondary" className="font-medium">
                                            {course.direction || "Разработка"}
                                        </Badge>                     
                                    </CardAction>
                                    
                                    <CardTitle>{course.title}</CardTitle> 
                                    <CardDescription>{course.description}</CardDescription>
                                    <CardDescription className="flex items-center gap-1">
                                        <Clock className="w-3 h-3" />
                                        <span className="font-bold text-black">Прогресс:</span> 
                                        <span className="text-yellow-600 font-medium">В процессе</span>
                                    </CardDescription>
                                </CardHeader>
                                
                                <CardFooter className="h-20">
                                    <Link href={`/course/${course.id}/lessons`} className="w-full">
                                        <Button className="w-full p-5 font-bold text-sm cursor-pointer bg-blue-600 hover:bg-blue-700">
                                            Продолжить обучение
                                        </Button>
                                    </Link>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                )}
            </div>

            {/* Пройденные курсы */}
            <div className="py-4 mt-8">
                <h2 className="text-2xl mb-4 flex items-center gap-2">
                    <CheckCircle className="w-6 h-6 text-green-500" />
                    Пройденные
                </h2>

                {completedCourses.length === 0 ? (
                    <div className="bg-gray-50 rounded-xl p-8 text-center border border-gray-200">
                        <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                        <p className="text-gray-500">У вас пока нет пройденных курсов</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                        {completedCourses.map((course) => (
                            <Card key={course.id} className="hover:shadow-xl transition-all duration-300">
                                <img
                                    src={course.image || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800"}
                                    alt={course.title}
                                    className="relative z-20 aspect-video w-full object-cover brightness-90 rounded-t-lg"
                                />
                                <CardHeader className="h-32 cursor-default">
                                    <CardAction className="grid gap-3">
                                        <Badge className="font-medium bg-green-100 text-green-700 hover:bg-green-100">
                                            {course.level || "Начинающий"}
                                        </Badge>                 
                                        <Badge variant="secondary" className="font-medium">
                                            {course.direction || "Разработка"}
                                        </Badge>                     
                                    </CardAction>
                                    
                                    <CardTitle>{course.title}</CardTitle> 
                                    <CardDescription>{course.description}</CardDescription>
                                    <CardDescription className="flex items-center gap-1">
                                        <CheckCircle className="w-3 h-3 text-green-500" />
                                        <span className="font-bold text-black">Статус:</span> 
                                        <span className="text-green-600 font-medium">Пройден</span>
                                    </CardDescription>
                                </CardHeader>
                                
                                <CardFooter className="h-20">
                                    <Link href={`/course/${course.id}`} className="w-full">
                                        <Button variant="outline" className="w-full p-5 font-bold text-sm cursor-pointer">
                                            Посмотреть сертификат
                                        </Button>
                                    </Link>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default DashboardPage;