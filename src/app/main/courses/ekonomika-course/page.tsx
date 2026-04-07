import CoursesTitle from "@/components/coursesTitle";
import MainDescription from "@/components/mainDescription";


const economyCoursesPage = () => {
    const titleCourses = 'Курсы по экономике'
    const descCourses = '"Основы финансов, микро- и макроэкономика. Изучите рыночные механизмы, инвестиции, бизнес-модели, анализ данных и стратегическое планирование. Теория подкреплена реальными кейсами и экономическими моделями."'

    return(
        <div>
            <CoursesTitle title={titleCourses} />
            <MainDescription description={descCourses} />


        </div>
    )
}

export default economyCoursesPage;