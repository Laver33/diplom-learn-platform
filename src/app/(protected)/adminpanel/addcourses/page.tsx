'use client'

import { useState } from "react";
import { db } from "@/lib/firebase/config";
import { doc, setDoc } from "firebase/firestore";
import { AddTests } from "@/components/AddTests";
import InputLessons from "@/components/inputLessons";
import InputText from "@/components/inputText";
import MainDescription from "@/components/mainDescription";
import PagesTitle from "@/components/pagesTitle";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";
import { 
  Zap, 
  Code2, 
  Leaf, 
  Globe, 
  Briefcase, 
  Sparkles,
  CheckCircle2
} from "lucide-react";

// Транслитерация русского в английский
const transliterate = (text: string): string => {
  const map: { [key: string]: string } = {
    'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ё': 'e',
    'ж': 'zh', 'з': 'z', 'и': 'i', 'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm',
    'н': 'n', 'о': 'o', 'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u',
    'ф': 'f', 'х': 'h', 'ц': 'ts', 'ч': 'ch', 'ш': 'sh', 'щ': 'sch', 'ъ': '',
    'ы': 'y', 'ь': '', 'э': 'e', 'ю': 'yu', 'я': 'ya'
  };
  
  return text
    .toLowerCase()
    .split('')
    .map(char => map[char] || (/[a-z0-9]/i.test(char) ? char : '_'))
    .join('')
    .replace(/_{2,}/g, '_')
    .replace(/^_|_$/g, '');
};

const AddCoursePage = () => {
    const AddCourseTitle = 'Добавить новый курс на сайт';
    const AddCourseDesc = 'Здесь вы можете спокойно добавить нужный вам курс. Заполните все поля и добавьте новый курс.';
    const fieldStyle = 'flex-1 py-2';
    const inputStyle = 'w-full';
    
    // Состояние формы
    const [courseData, setCourseData] = useState({
        courseId: '',
        title: '',
        level: '',
        description: '',
        direction: '',
        type: 'dev' as 'dev' | 'economic' | 'english' | 'ecology',
        icon_1: 'Zap',
        icon_2: 'Code2',
        introduction: '',
        writing_guidelines: '',
        lessons: Array(9).fill({ title: '', content: '' })
    });
    
    const [loading, setLoading] = useState(false);
    
    // Доступные иконки
    const iconOptions = [
        { value: 'Zap', label: '⚡ Zap', icon: Zap },
        { value: 'Code2', label: '💻 Code2', icon: Code2 },
        { value: 'Leaf', label: '🌿 Leaf', icon: Leaf },
        { value: 'Globe', label: '🌍 Globe', icon: Globe },
        { value: 'Briefcase', label: '💼 Briefcase', icon: Briefcase },
        { value: 'Sparkles', label: '✨ Sparkles', icon: Sparkles },
    ];
    
    // Типы курсов
    const courseTypes = [
        { value: 'dev', label: 'Разработка (Dev)', color: 'blue' },
        { value: 'economic', label: 'Экономика (Economic)', color: 'green' },
        { value: 'english', label: 'Английский (English)', color: 'purple' },
        { value: 'ecology', label: 'Экология (Ecology)', color: 'emerald' },
    ];
    
    // Обновление полей курса
    const updateCourseField = (field: string, value: any) => {
        setCourseData(prev => ({ ...prev, [field]: value }));
        
        // Автоматическая генерация courseId из названия
        if (field === 'title') {
            const generatedId = transliterate(value);
            setCourseData(prev => ({ ...prev, courseId: generatedId }));
        }
    };
    
    // Обновление уроков
    const updateLesson = (index: number, field: 'title' | 'content', value: string) => {
        const updatedLessons = [...courseData.lessons];
        updatedLessons[index] = { ...updatedLessons[index], [field]: value };
        setCourseData(prev => ({ ...prev, lessons: updatedLessons }));
    };
    
    // Сохранение в Firestore
    const saveCourse = async () => {
        // Валидация
        if (!courseData.courseId) {
            toast.error('Название курса обязательно');
            return;
        }
        if (!courseData.title) {
            toast.error('Название курса обязательно');
            return;
        }
        
        setLoading(true);
        
        try {
            const courseRef = doc(db, 'courses', courseData.courseId);
            await setDoc(courseRef, {
                title: courseData.title,
                level: courseData.level,
                description: courseData.description,
                direction: courseData.direction,
                type: courseData.type,
                icon_1: courseData.icon_1,
                icon_2: courseData.icon_2,
                introduction: courseData.introduction,
                writing_guidelines: courseData.writing_guidelines,
                lessons: courseData.lessons.filter(l => l.title || l.content), // Убираем пустые
                createdAt: new Date().toISOString(),
            });
            
            toast.success('Курс успешно добавлен!');
            
            // Очистка формы (опционально)
            setCourseData({
                courseId: '',
                title: '',
                level: '',
                description: '',
                direction: '',
                type: 'dev',
                icon_1: 'Zap',
                icon_2: 'Code2',
                introduction: '',
                writing_guidelines: '',
                lessons: Array(9).fill({ title: '', content: '' })
            });
            
        } catch (error) {
            console.error('Ошибка при сохранении:', error);
            toast.error('Ошибка при сохранении курса');
        } finally {
            setLoading(false);
        }
    };


    // Тесты
    const [tests, setTests] = useState<any>(null);

    // функция сохранения тестов:
    const saveTests = async (testData: { questions: any[], passingScore: number }) => {
        if (!courseData.courseId) {
            toast.error('Сначала сохраните курс');
            return;
        }
        
        try {
            const testsRef = doc(db, 'courses', courseData.courseId, 'tests', 'main');
            await setDoc(testsRef, {
                questions: testData.questions,
                passingScore: testData.passingScore,
                createdAt: new Date().toISOString()
            });
            setTests(testData);
            toast.success('Тесты сохранены!');
        } catch (error) {
            console.error('Ошибка:', error);
            toast.error('Ошибка при сохранении тестов');
        }
    };
    
    return(
        <div className="max-w-7xl mx-auto">
            <PagesTitle title={AddCourseTitle} />
            <MainDescription description={AddCourseDesc} />

            <div className="add-course mt-3 p-6 border rounded-2xl bg-white shadow-sm">
                
                <h3 className="text-xl font-semibold flex justify-center items-center text-gray-800 mb-6">
                    Заполните все поля для добавления вашего курса
                </h3>

                <div className="add-title-course-content">
                    
                    {/* ID курса (автоматически) */}
                    <div className="mb-6 px-5">
                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                            <label className="text-sm font-medium text-gray-700">ID курса (автоматически)</label>
                            <p className="text-sm text-gray-500 mt-1">
                                Будет сгенерирован из названия: <code className="bg-gray-100 px-2 py-1 rounded">{courseData.courseId || '___'}</code>
                            </p>
                        </div>
                    </div>

                    {/* Основная информация */}
                    <h4 className="my-6 text-lg font-semibold text-gray-800 px-5">Добавление основной информации о курсе</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-5">
                        <InputText 
                            inputClassName={fieldStyle}
                            maxLength={20}
                            value={courseData.title} 
                            place={"Макс 20 символов"} 
                            titleField={"Название курса"} 
                            setFunc={(value) => updateCourseField('title', value)}
                        />

                        <InputText 
                            inputClassName={fieldStyle}
                            maxLength={15}
                            value={courseData.level} 
                            place={"Макс 15 символов"} 
                            titleField={"Уровень курса (пример: Интерн, Мидл)"} 
                            setFunc={(value) => updateCourseField('level', value)}
                        />

                        <InputText 
                            inputClassName={fieldStyle}
                            maxLength={120}
                            value={courseData.description} 
                            place={"Макс 120 символов"} 
                            titleField={"Описание курса для карточки"} 
                            setFunc={(value) => updateCourseField('description', value)}
                        />

                        <InputText 
                            inputClassName={fieldStyle}
                            maxLength={20}
                            value={courseData.direction} 
                            place={"Макс 20 символов"} 
                            titleField={"Направление/сфера"} 
                            setFunc={(value) => updateCourseField('direction', value)}
                        />
                    </div>

                    {/* Тип курса (чекбоксы) */}
                    <div className="mt-8 px-5">
                        <label className="text-sm font-medium text-gray-700 block mb-3">Тип курса</label>
                        <div className="flex flex-wrap gap-4">
                            {courseTypes.map((type) => (
                                <label
                                    key={type.value}
                                    className={`flex items-center gap-3 px-4 py-2 rounded-lg border-2 cursor-pointer transition-all ${
                                        courseData.type === type.value
                                            ? `border-${type.color}-500 bg-${type.color}-50`
                                            : 'border-gray-200 hover:border-gray-300'
                                    }`}
                                >
                                    <input
                                        type="radio"
                                        name="courseType"
                                        value={type.value}
                                        checked={courseData.type === type.value}
                                        onChange={(e) => updateCourseField('type', e.target.value)}
                                        className="w-4 h-4 text-blue-600"
                                    />
                                    <span className={`text-sm font-medium ${
                                        courseData.type === type.value ? `text-${type.color}-700` : 'text-gray-700'
                                    }`}>
                                        {type.label}
                                    </span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Иконки */}
                    <div className="mt-8 px-5">
                        <label className="text-sm font-medium text-gray-700 block mb-3">Иконки курса</label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="text-xs text-gray-500 block mb-2">Иконка 1</label>
                                <div className="flex gap-3 flex-wrap">
                                    {iconOptions.map((icon) => (
                                        <button
                                            key={icon.value}
                                            type="button"
                                            onClick={() => updateCourseField('icon_1', icon.value)}
                                            className={`p-3 rounded-lg border-2 transition-all ${
                                                courseData.icon_1 === icon.value
                                                    ? 'border-blue-500 bg-blue-50'
                                                    : 'border-gray-200 hover:border-gray-300'
                                            }`}
                                        >
                                            <icon.icon className={`w-5 h-5 ${
                                                courseData.icon_1 === icon.value ? 'text-blue-600' : 'text-gray-600'
                                            }`} />
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <label className="text-xs text-gray-500 block mb-2">Иконка 2</label>
                                <div className="flex gap-3 flex-wrap">
                                    {iconOptions.map((icon) => (
                                        <button
                                            key={icon.value}
                                            type="button"
                                            onClick={() => updateCourseField('icon_2', icon.value)}
                                            className={`p-3 rounded-lg border-2 transition-all ${
                                                courseData.icon_2 === icon.value
                                                    ? 'border-blue-500 bg-blue-50'
                                                    : 'border-gray-200 hover:border-gray-300'
                                            }`}
                                        >
                                            <icon.icon className={`w-5 h-5 ${
                                                courseData.icon_2 === icon.value ? 'text-blue-600' : 'text-gray-600'
                                            }`} />
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Детальное описание */}
                    <h4 className="my-6 text-lg font-semibold text-gray-800 px-5">Добавление информации для страницы описания курса</h4>
                    <div className="grid grid-cols-1 gap-8 px-5">
                        <InputText 
                            inputClassName={fieldStyle}
                            maxLength={2000}
                            value={courseData.introduction} 
                            place={"Макс 2000 символов"} 
                            titleField={"Полное описание курса (Introduction)"} 
                            setFunc={(value) => updateCourseField('introduction', value)}
                        />

                        <InputText 
                            inputClassName={fieldStyle}
                            maxLength={2000}
                            value={courseData.writing_guidelines} 
                            place={"Макс 2000 символов"} 
                            titleField={"Технологии и требования (Writing Guidelines)"} 
                            setFunc={(value) => updateCourseField('writing_guidelines', value)}
                        />
                    </div>

                    {/* Уроки */}
                    <h4 className="my-6 text-lg font-semibold text-gray-800 px-5">Заполнение информации о уроках (9 уроков)</h4>
                    
                    <div className="rules-lessons-content mx-5 p-4 rounded-xl bg-blue-50 border border-blue-200 mb-6">
                        <p className="font-semibold text-blue-800">📋 Краткие правила при заполнении:</p>
                        <p className="text-sm text-gray-600 mt-1">Максимальная длина названия урока - 20 символов</p>
                        <p className="text-sm text-gray-600">Максимальная длина контента урока - 5000 символов</p>
                    </div>

                    <div className="flex flex-col gap-6 px-5">
                        {courseData.lessons.map((lesson, index) => (
                            <div key={index} className="border border-gray-200 rounded-xl p-4 bg-gray-50">
                                <div className="flex items-center gap-2 mb-3">
                                    <CheckCircle2 className="w-5 h-5 text-blue-500" />
                                    <span className="font-medium text-gray-700">Урок {index + 1}</span>
                                </div>
                                <InputLessons 
                                    valueTitle={lesson.title} 
                                    titleFieldTitle={`Название урока ${index + 1}`} 
                                    valueLesson={lesson.content} 
                                    titleFieldLesson={""} 
                                    inputClassNameTitle="w-full"
                                    inputClassNameLesson="w-full"
                                    setFuncTitle={(value) => updateLesson(index, 'title', value)}
                                    setFuncLesson={(value) => updateLesson(index, 'content', value)} 
                                />
                            </div>
                        ))}
                    </div>

                    <h4 className="my-6 text-lg font-semibold text-gray-800 px-5">Добавление тестов для курса</h4>
                    <div className="px-5">
                        <AddTests 
                            courseId={courseData.courseId} 
                            onSave={saveTests}
                        />
                    </div>

                    {/* Кнопка сохранения */}
                    <div className="px-5 mt-8">
                        <Button
                            onClick={saveCourse}
                            disabled={loading}
                            className="w-full md:w-auto px-8 py-6 text-lg font-semibold bg-linear-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 transition-all"
                        >
                            {loading ? 'Сохранение...' : '💾 Сохранить курс'}
                        </Button>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default AddCoursePage;