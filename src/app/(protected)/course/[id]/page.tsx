'use client'
import { useCourse } from "@/hooks/queries/useCourse";
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


            <div className="bg-amber-50">
                {/* <p>контент</p> */}
            </div>
        
        </div>
    )
}

export default CourseDetailPage;

