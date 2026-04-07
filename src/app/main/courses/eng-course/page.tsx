import CoursesTitle from "@/components/coursesTitle";
import MainDescription from "@/components/mainDescription";



const englishCoursesPage = () => {
    const titleCourses = 'Курсы по английскому языку'
    const descCourses = '"Грамматика, лексика и коммуникативные навыки для повседневного общения и профессиональной деятельности. Темы: деловой английский, подготовка к экзаменам (IELTS/TOEFL), технический перевод и разговорные практики."'

    return(
        <div>
            <CoursesTitle title={titleCourses} />
            <MainDescription description={descCourses} />

        </div>
    )
}

export default englishCoursesPage;