'use client'

import { useState, useEffect } from "react";
import { auth, db } from "@/lib/firebase/config";
import { doc, getDoc, collection, getDocs, query, where } from "firebase/firestore";
import MainDescription from "@/components/mainDescription";
import MainStatistic from "@/components/mainStatistic";
import MainWelcome from "@/components/mainWelcome";
import { Card, CardHeader, CardTitle, CardDescription, CardFooter, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { BookOpen, CheckCircle, User, Mail, Shield } from "lucide-react";

const MainPage = () => {
    const mainDescription = 'Рады вас видеть на нашей платформе, это главная страница на которой вы можете увидеть достаточно информации.';
    
    const [user, setUser] = useState<any>(null);
    const [completedCourses, setCompletedCourses] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadUserData();
    }, []);

    const loadUserData = async () => {
        const userId = auth.currentUser?.uid;
        if (!userId) {
            setLoading(false);
            return;
        }

        try {
            const userRef = doc(db, 'users', userId);
            const userSnap = await getDoc(userRef);
            const userData = userSnap.data();
            setUser(userData);

            const progress = userData?.courseProgress || {};
            
            // Проверка ( Посмотрел уроки = прошел )
            const completedCourseIds = Object.keys(progress).filter(courseId => {
                const courseProgress = progress[courseId];

                const hasTestPassed = courseProgress?.testPassed === true;
                const allLessonsCompleted = courseProgress?.completedLessons?.length >= (courseProgress?.totalLessons || 0);
                return hasTestPassed || (allLessonsCompleted && !courseProgress?.hasTest);
            });

            if (completedCourseIds.length > 0) {
                const coursesRef = collection(db, 'courses');
                const q = query(coursesRef, where('__name__', 'in', completedCourseIds));
                const coursesSnap = await getDocs(q);
                const coursesData = coursesSnap.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setCompletedCourses(coursesData);
            }
        } catch (error) {
            console.error('Ошибка загрузки:', error);
        } finally {
            setLoading(false);
        }
    };

    const getUserRole = () => {
        if (!user) return 'Обычный пользователь';
        if (user.role === 'admin') return 'Администратор';
        return 'Обычный пользователь';
    };

    return (
        <div>
            <MainWelcome />
            <MainDescription description={mainDescription} />
            <MainStatistic />

            <div className="flex gap-6 mt-8">

                {/* Пройденные курсы */}
                <div className="flex-1">
                    <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                        <CheckCircle className="w-6 h-6 text-green-500" />
                        Пройденные курсы
                    </h2>
                    
                    {loading ? (
                        <div className="text-center py-8">Загрузка...</div>
                    ) : completedCourses.length === 0 ? (
                        <Card className="bg-gray-50">
                            <CardContent className="pt-6 text-center">
                                <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                                <p className="text-gray-500">У вас пока нет пройденных курсов</p>
                                <Link href="/courses">
                                    <Button className="mt-3">Начать обучение</Button>
                                </Link>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            {completedCourses.map((course) => (
                                <Card key={course.id} className="hover:shadow-lg transition-all">
                                    <CardHeader>
                                        <div className="flex gap-2 mb-2">
                                            <Badge className="bg-green-500">Пройден</Badge>
                                            <Badge variant="secondary">{course.level}</Badge>
                                        </div>
                                        <CardTitle>{course.title}</CardTitle>
                                        <CardDescription>{course.description}</CardDescription>
                                    </CardHeader>
                                    <CardFooter>
                                        <Link href={`/course/${course.id}`} className="w-full">
                                            <Button variant="outline" className="w-full">
                                                Посмотреть сертификат
                                            </Button>
                                        </Link>
                                    </CardFooter>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>


                {/* Информация об аккаунте справа */}
                <div className="w-80 shrink-0">
                    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                        <div className="bg-gray-50 px-5 py-3 border-b border-gray-200">
                            <h3 className="font-semibold text-gray-800">Информация об аккаунте</h3>
                        </div>
                        
                        <div className="p-5 space-y-4">
                            <div className="flex items-start gap-3">
                                <User className="w-4 h-4 text-gray-400 mt-0.5" />
                                <div>
                                    <p className="text-xs text-gray-400">Имя и фамилия</p>
                                    <p className="text-sm text-gray-800">
                                        {user?.name || user?.firstName || '—'} {user?.surname || user?.lastName || ''}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <Mail className="w-4 h-4 text-gray-400 mt-0.5" />
                                <div>
                                    <p className="text-xs text-gray-400">Email</p>
                                    <p className="text-sm text-gray-800">{user?.email || auth.currentUser?.email || '—'}</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <Shield className="w-4 h-4 text-gray-400 mt-0.5" />
                                <div>
                                    <p className="text-xs text-gray-400">Статус</p>
                                    <p className="text-sm text-gray-800">{getUserRole()}</p>
                                </div>
                            </div>

                            <div className="border-t border-gray-100 pt-3 mt-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Пройдено курсов</span>
                                    <span className="font-semibold">{completedCourses.length}</span>
                                </div>
                                <div className="flex justify-between text-sm mt-2">
                                    <span className="text-gray-500">В избранном</span>
                                    <span className="font-semibold">{user?.coursesArr?.length || 0}</span>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>


                
            </div>
        </div>
    );
}

export default MainPage;