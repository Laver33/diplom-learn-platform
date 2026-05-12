'use client'
import DynamicIcon from "@/components/DynamicIcon";
import { Button } from "@/components/ui/button";
import { useCourse } from "@/hooks/queries/useCourse";
import {  Heart, Icon } from "lucide-react";
import { useParams } from "next/navigation";


const CourseDetailPage = () => {

    const params = useParams()
    const id = params.id as string | undefined

    const { data: course, isLoading, error } = useCourse(id)

    if (isLoading) {
        return(<><p></p></>)
    }
    if (error) {
        return(<><p>Ошибка</p></>)
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
                <div className="right-content grid gap-2 pt-4  w-3/12">

                <div className="btns p-2 h-24 grid gap-1">

                    <Button 
                        className="h-14 bg-green-500 font-semibold text-base hover:bg-green-600 duration-700"
                    >Поступить на курс</Button>

                    <Button 
                        variant='outline'
                        className="h-14  font-semibold text-base"
                    >   <Heart className="h-4 w-4" />
                        Хочу пройти</Button>

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

