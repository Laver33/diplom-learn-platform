import PagesTitle from "@/components/pagesTitle";
import MainDescription from "@/components/mainDescription";
import CoursesList from "@/components/coursesList";


const economyCoursesPage = () => {
    const titleCourses = 'Курсы по экономике'
    const descCourses = 'Основы финансов, микро- и макроэкономика. Изучите рыночные механизмы, инвестиции, бизнес-модели, анализ данных и стратегическое планирование. Теория подкреплена реальными кейсами и экономическими моделями.'

    return(
        <div>
            <PagesTitle title={titleCourses} />
            <MainDescription description={descCourses} />
            <CoursesList typeHook={"economic"} />

        </div>
    )
}

export default economyCoursesPage;