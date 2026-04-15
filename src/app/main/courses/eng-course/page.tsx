import PagesTitle from "@/components/pagesTitle";
import MainDescription from "@/components/mainDescription";
import CoursesList from "@/components/coursesList";



const englishCoursesPage = () => {
    const titleCourses = 'Курсы по английскому языку'
    const descCourses = 'Грамматика, лексика и коммуникативные навыки для повседневного общения и профессиональной деятельности. Темы: деловой английский, подготовка к экзаменам (IELTS/TOEFL), технический перевод и разговорные практики.'

    return(
        <div>
            <PagesTitle title={titleCourses} />
            <MainDescription description={descCourses} />
            <CoursesList typeHook={"english"} />

        </div>
    )
}

export default englishCoursesPage;