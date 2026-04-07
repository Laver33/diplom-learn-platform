import CoursesTitle from "@/components/coursesTitle";
import MainDescription from "@/components/mainDescription";







const developmentCoursesPage = () => {
    const titleCourses = 'Курсы по разработке'
    const descCourses = '"Программирование и IT-навыки: от основ до продвинутых технологий. Изучите языки, фреймворки и инструменты для создания веб-приложений, мобильных приложений и программного обеспечения. Курсы включают теорию архитектуры ПО, алгоритмы, базы данных и тестирование кода."'

    return(
        <div>
            <CoursesTitle title={titleCourses} />
            <MainDescription description={descCourses} />

        </div>
    )
}

export default developmentCoursesPage;