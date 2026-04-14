'use client'
import PagesTitle from "@/components/pagesTitle";
import MainDescription from "@/components/mainDescription";
import CoursesList from "@/components/coursesList";







const developmentCoursesPage = () => {
    const titleCourses = 'Курсы по разработке'
    const descCourses = '"Программирование и IT-навыки: от основ до продвинутых технологий. Изучите языки, фреймворки и инструменты для создания веб-приложений, мобильных приложений и программного обеспечения. Курсы включают теорию архитектуры ПО, алгоритмы, базы данных и тестирование кода."'

    return(
        <div>
            <PagesTitle title={titleCourses} />
            <MainDescription description={descCourses} />
            <CoursesList />

        </div>
    )
}

export default developmentCoursesPage;