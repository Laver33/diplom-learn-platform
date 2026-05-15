'use client'

import { Card, CardHeader, CardTitle, CardDescription, CardFooter, CardAction } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useUserCourses } from "@/hooks/queries/useWishList"

const CoursesWishList = (props: {userId: string | undefined}) => {
    const { data: courses, isLoading, error } = useUserCourses(props.userId)

    if (isLoading) return <div className="text-4xl flex justify-center items-center h-screen">Загрузка...</div>
    if (error) return <div>Ошибка: {error.message}</div>

    return(
        <div className="py-4">
            <h2 className="text-2xl mb-4">Список желаемых курсов</h2>

            <div className="overflow-y-auto">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 px-4">
                    {courses?.map(course => (
                        <Card key={course.id} className="w-11/12 hover:shadow-xl hover:duration-500">
                            <img
                                src={course.image || "https://avatar.vercel.sh/shadcn1"}
                                alt={course.title}
                                className="relative z-20 aspect-video w-full object-cover brightness-60 grayscale dark:brightness-40 rounded-t-lg"
                            />
                            <CardHeader className="h-32 cursor-default">
                                <CardAction className="grid gap-3">
                                    <Badge 
                                        className="font-medium" 
                                    >{course.level || "Featured"}</Badge>                 

                                    <Badge 
                                        className="font-medium" 
                                        variant="secondary"
                                    >{course.direction || "Featured"}</Badge>                     
                                </CardAction>
                                
                                <CardTitle>{course.title}</CardTitle> 
                                <CardDescription>{course.description}</CardDescription>
                                <CardDescription><span className="font-bold text-black">Длительность:</span>{course.duration} мин</CardDescription>
                            </CardHeader>
                            
                            <CardFooter className="h-20">
                                <Link href={`/course/${course.id}`}>
                                    <Button className="w-full p-5 font-bold text-sm cursor-pointer">Посмотреть</Button>
                                </Link>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default CoursesWishList;