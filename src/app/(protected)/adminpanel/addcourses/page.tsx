'use client'

import InputLessons from "@/components/inputLessons";
import InputText from "@/components/inputText";
import MainDescription from "@/components/mainDescription";
import PagesTitle from "@/components/pagesTitle";
import { Button } from "@/components/ui/button";


const AddCoursePage = () => {
    const AddCourseTitle = 'Добавить новый курс на сайт'
    const AddCourseDesc = 'Здесь вы можете спокойно добавить нужный вам курс. Заполните все поля и добавьте новый курс.'
    const fieldStyle = 'flex-1 py-2'

    const titleStyle = ''
    const contentStyle = 'p-3'


    // Тестовые данные

    // Для заполнения уроков
    const lessonsArr = [
        {id: 1, title: 'Название первого урока'},
        {id: 2, title: 'Название второго урока'},
        {id: 3, title: 'Название третьего урока'},
        {id: 4, title: 'Название четвертого урока'},
        {id: 5, title: 'Название пятого урока'},
        {id: 6, title: 'Название шестого урока'},
        {id: 7, title: 'Название седьмого урока'},
        {id: 8, title: 'Название восьмого урока'},
        {id: 9, title: 'Название девятого урока'},
    ]


    return(
        <div>
            <PagesTitle title={AddCourseTitle} />
            <MainDescription description={AddCourseDesc} />

            <div className="add-course grid mt-3 p-3 border rounded-2xl bg-white">
                
                <h3 className="text-xl font-semibold flex justify-center items-center">Заполните все поля для добавляния вашего курса.</h3>


                <div className="add-title-course-content">
                    <h4 className="my-6 text-lg">Добавление основной информации о курсе</h4>

                    {/* Тут все поля для карточки */}
                    <div 
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-5"
                    >
                        <InputText 
                            inputClassName={fieldStyle}
                            maxLength={20}
                            value={""} 
                            place={"Макс 20 символов"} 
                            titleField={"Название курса"} 
                            setFunc={ () => {} }
                        />

                        <InputText 
                            inputClassName={fieldStyle}
                            maxLength={15}
                            value={""} 
                            place={"Макс 15 символов"} 
                            titleField={"Уровень курса (пример: Интерн, Мидл)"} 
                            setFunc={ () => {} }
                        />

                        <InputText 
                            inputClassName={fieldStyle}
                            maxLength={120}
                            value={""} 
                            place={"Макс 120 символов"} 
                            titleField={"Описание курса для карточки"} 
                            setFunc={ () => {} }
                        />

                        <InputText 
                            inputClassName={fieldStyle}
                            maxLength={20}
                            value={""} 
                            place={"Макс 20 символов"} 
                            titleField={"Направление/сфера"} 
                            setFunc={ () => {} }
                        />
                    </div>

                    <h4 className="my-6 text-lg">Добавление информации для страницы описания курса</h4>

                    {/* Информация о курсе ддя страницы */}
                    <div 
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-5"
                    >

                        <InputText 
                            inputClassName={fieldStyle}
                            maxLength={2000}
                            value={""} 
                            place={"Макс 2000 символов"} 
                            titleField={"Полное описание курса"} 
                            setFunc={ () => {} }
                        />

                        <InputText 
                            inputClassName={fieldStyle}
                            maxLength={2000}
                            value={""} 
                            place={"Макс 2000 символов"} 
                            titleField={"Полное описание сферы/технологий"} 
                            setFunc={ () => {} }
                        />

                    </div>

                    <h4 className="my-6 text-lg">Заполнение информации о уроках ( 9 уроков )</h4>
                    
                    <div className="rules-lessons-content mx-5 p-4 rounded-2xl bg-blue-300 w-max mb-4">
                        <p className="font-semibold">Краткие правила при заполнениях:</p>
                        <p className="text-sm text-gray-600">Макимальная длина названия урока - 20 символов</p>
                        <p className="text-sm text-gray-600">Макимальная длина контента урока - 5000 символов</p>
                    </div>

                    <div 
                        className="flex flex-col gap-8 px-5 "
                    >

                    {lessonsArr.map((lesson) => <InputLessons 
                        key={lesson.id}
                        valueTitle={""} 
                        titleFieldTitle={lesson.title} 
                        valueLesson={""} 
                        titleFieldLesson={""} 
                        inputClassNameTitle={titleStyle}
                        inputClassNameLesson={contentStyle}
                        setFuncTitle={ () => {} }
                        setFuncLesson={ () => {} } 
                    />)}

                    </div>

                    <Button
                        className="my-6 p-5 ml-4"
                    >Сохранить курс</Button>

                </div>

            </div>
        
        </div>
    )
}

export default AddCoursePage;