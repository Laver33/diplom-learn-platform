import PagesTitle from "@/components/pagesTitle";
import MainDescription from "@/components/mainDescription";
import CoursesList from "@/components/coursesList";



const ecologyCoursesPage = () => {
    const titleCourses = 'Курсы по экологии'
    const descCourses = 'Охрана окружающей среды и устойчивое развитие. Погрузитесь в темы: изменение климата, возобновляемая энергия, управление отходами, сохранение биоразнообразия. Теоретические материалы помогут понять экологические вызовы и пути их решения.'

    return(
        <div>
            <PagesTitle title={titleCourses} />
            <MainDescription description={descCourses} />
            <CoursesList typeHook={"ecology"} />

        </div>
    )
}

export default ecologyCoursesPage;