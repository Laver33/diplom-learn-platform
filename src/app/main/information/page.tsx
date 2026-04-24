"use client"

const AboutPage = () => {


  return (
    <div className="flex items-center justify-center my-auto">
        <div className="max-w-4xl mx-auto px-4 py-12 w-full">

        {/* Заголовок */}
        <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-slate-800 mb-4">О проекте</h1>
            <p className="text-lg text-slate-600">
            Образовательная платформа для будущих IT-специалистов
            </p>
        </div>

        {/* Миссия */}
        <div className="bg-blue-50 rounded-2xl p-8 mb-12 shadow-sm">
            <h2 className="text-2xl font-semibold text-blue-800 mb-3">Наша миссия</h2>
            <p className="text-slate-700 leading-relaxed">
            Сделать качественное IT-образование доступным для каждого. 
            Мы создаем курсы, которые помогают освоить востребованные навыки 
            и начать карьеру в технологической сфере.
            </p>
        </div>

        {/* Что мы предлагаем */}
        <h2 className="text-2xl font-bold text-slate-800 mb-6">Что мы предлагаем?</h2>

        <div className="grid md:grid-cols-2 gap-6 mb-12 cursor-default">
            <div className="border rounded-xl p-6 hover:shadow-md transition">
            <h3 className="text-xl font-semibold text-slate-800 mb-2">📚 Структурированные курсы</h3>
            <p className="text-slate-600">Теория + тесты для закрепления материала</p>
            </div>

            <div className="border rounded-xl p-6 hover:shadow-md transition cursor-default">
            <h3 className="text-xl font-semibold text-slate-800 mb-2">📊 Отслеживание прогресса</h3>
            <p className="text-slate-600">Следите за своими достижениями</p>
            </div>

            <div className="border rounded-xl p-6 hover:shadow-md transition cursor-default">
            <h3 className="text-xl font-semibold text-slate-800 mb-2">🎯 Разные уровни</h3>
            <p className="text-slate-600">От Интерна до Миддл разработчика</p>
            </div>

            <div className="border rounded-xl p-6 hover:shadow-md transition cursor-default">
            <h3 className="text-xl font-semibold text-slate-800 mb-2">🔒 Безопасность</h3>
            <p className="text-slate-600">Ваши данные под надежной защитой</p>
            </div>
        </div>

        {/* Технологии */}
        <h2 className="text-2xl font-bold text-slate-800 mb-6">Технологии разработки</h2>
        <div className="flex flex-wrap gap-3 mb-12">
            {["Next.js", "TypeScript", "Firebase", "Tailwind CSS", "Zustand", "Shadcn", "React Query"].map(tech => (
            <span key={tech} className="bg-slate-100 px-4 py-2 rounded-full text-slate-700 text-sm">
                {tech}
            </span>
            ))}
        </div>

        {/* Разработчик */}
        <div className="bg-slate-100 rounded-2xl p-6 text-center">
            <p className="text-slate-600">Разработал Драбеня Павел студент ГГКТТиД</p>
            <p className="text-sm text-slate-400 mt-2">Версия 1.0</p>
        </div>
        </div>
    </div>
  )
}

export default AboutPage