import CoursesTitle from "@/components/coursesTitle";
import MainDescription from "@/components/mainDescription";



const ecologyCoursesPage = () => {
    const titleCourses = 'Курсы по экологии'
    const descCourses = '"Охрана окружающей среды и устойчивое развитие. Погрузитесь в темы: изменение климата, возобновляемая энергия, управление отходами, сохранение биоразнообразия. Теоретические материалы помогут понять экологические вызовы и пути их решения."'

    return(
        <div>
            <CoursesTitle title={titleCourses} />
            <MainDescription description={descCourses} />

        </div>
    )
}

export default ecologyCoursesPage;