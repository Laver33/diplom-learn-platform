'use client'
import DynamicIcon from "@/components/DynamicIcon";
import { Button } from "@/components/ui/button";
import { useCourse } from "@/hooks/queries/useCourse";
import { auth, db } from "@/lib/firebase/config";
import { doc, updateDoc, arrayUnion, arrayRemove, getDoc } from "firebase/firestore";
import { Heart } from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const CourseDetailPage = () => {

    const params = useParams()
    const id = params.id as string | undefined

    const { data: course, isLoading, error } = useCourse(id)

    // Состояние
    const [isAddCourse, setIsAddCourse] = useState(false)
    const userId = auth.currentUser?.uid;

    // Проверка
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

    // Функция добавления
    async function addToCoursesArr() {
        try {

            if (!userId) return;
            
            const userRef = doc(db, 'users', userId);
            
            await updateDoc(userRef, {
                coursesArr: arrayUnion(id)
            });
            
            setIsAddCourse(true);

            toast('Добавлен в избранное', {
                icon: '😉',
            });

        } catch(err){
            return console.log('Error: ', err)
        }
    }

    // Функция удаления
    async function removeFromCoursesArr() {

        try {

            if (!userId) return;
            
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


    // Проверки
    if (isLoading) {
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

            {/* Инфа о курсе */}
            <div className="flex">

                {/* Левая часть */}
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

                {/* Правая часть */}
                <div className="right-content grid gap-2 pt-4 w-3/12">
                    <div className="btns p-2 h-24 grid gap-1">
                        <Button 
                            className="h-14 bg-green-500 font-semibold text-base hover:bg-green-600 duration-700"
                        >
                            Поступить на курс
                        </Button>

                        <Button 
                            variant='outline'
                            className="h-14 font-semibold text-base"
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
                            <p>уроков: </p>
                            <p>создан: </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CourseDetailPage;