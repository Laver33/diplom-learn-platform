"use client"

import { Code2, GraduationCap, Shield, Target, TrendingUp, Users, Zap, BookOpen, Award, Sparkles } from "lucide-react";

const AboutPage = () => {

  return (
    <div className="min-h-screen bg-linear-to-b from-slate-50 to-white">
      <div className="max-w-6xl mx-auto px-4 py-12">
        
        {/* Hero секция - Заголовок */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 cursor-default bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4" />
            Добро пожаловать
          </div>
          <h1 className="text-5xl md:text-6xl font-bold cursor-default bg-linear-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent mb-4">
            О проекте
          </h1>
          <p className="text-xl text-slate-600 cursor-default max-w-2xl mx-auto">
            Образовательная платформа для будущих IT-специалистов
          </p>
        </div>

        {/* Миссия - акцентный блок */}
        <div className="relative mb-16">
          <div className="absolute inset-0 bg-linear-to-r from-blue-600 to-indigo-600 rounded-2xl blur-2xl opacity-20"></div>
          <div className="relative bg-white rounded-2xl p-8 md:p-10 shadow-xl border border-slate-100">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center shrink-0">
                <Target className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-2xl md:text-3xl font-bold cursor-default text-slate-800 mb-3">Наша миссия</h2>
                <p className="text-slate-600 cursor-default leading-relaxed text-lg">
                  Сделать качественное IT-образование доступным для каждого. 
                  Мы создаем курсы, которые помогают освоить востребованные навыки 
                  и начать карьеру в технологической сфере.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Что мы предлагаем */}
        <div className="mb-16">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-slate-800 mb-3">Что мы предлагаем?</h2>
            <p className="text-slate-500">Все необходимое для эффективного обучения</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: BookOpen, title: "Структурированные курсы", desc: "Теория + тесты для закрепления материала", color: "blue" },
              { icon: TrendingUp, title: "Отслеживание прогресса", desc: "Следите за своими достижениями", color: "green" },
              { icon: GraduationCap, title: "Разные уровни", desc: "От Интерна до Миддл разработчика", color: "purple" },
              { icon: Shield, title: "Безопасность", desc: "Ваши данные под надежной защитой", color: "orange" },
            ].map((item, index) => {
              const Icon = item.icon;
              const colorClasses = {
                blue: "bg-blue-50 text-blue-600 border-blue-100",
                green: "bg-green-50 text-green-600 border-green-100",
                purple: "bg-purple-50 text-purple-600 border-purple-100",
                orange: "bg-orange-50 text-orange-600 border-orange-100",
              }[item.color];
              
              return (
                <div 
                  key={index}
                  className="group bg-white rounded-xl p-6 border border-slate-200 hover:shadow-lg hover:border-transparent transition-all duration-300 cursor-default"
                >
                  <div className={`w-12 h-12 rounded-xl ${colorClasses} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-800 mb-2">{item.title}</h3>
                  <p className="text-slate-500 text-sm">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Статистика */}
        <div className="mb-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { value: "4+", label: "Направлений", icon: Code2 },
              { value: "10+", label: "Курсов", icon: BookOpen },
              { value: "50+", label: "Уроков", icon: Users },
              { value: "100%", label: "Онлайн", icon: Zap },
            ].map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="text-center p-6 bg-white rounded-xl border border-slate-200">
                  <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Icon className="w-5 h-5 text-slate-600" />
                  </div>
                  <div className="text-2xl font-bold text-slate-800">{stat.value}</div>
                  <div className="text-sm text-slate-500">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Технологии */}
        <div className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-slate-800 mb-3">Технологии разработки</h2>
            <p className="text-slate-500">Современный стек для лучшего опыта</p>
          </div>
          
          <div className="bg-white rounded-xl border border-slate-200 p-8">
            <div className="flex flex-wrap justify-center gap-3">
              {[
                { name: "Next.js", color: "bg-black text-white" },
                { name: "TypeScript", color: "bg-blue-600 text-white" },
                { name: "Firebase", color: "bg-amber-600 text-white" },
                { name: "Tailwind CSS", color: "bg-cyan-600 text-white" },
                { name: "Zustand", color: "bg-amber-500 text-white" },
                { name: "Shadcn UI", color: "bg-slate-700 text-white" },
                { name: "React Query", color: "bg-red-500 text-white" },
              ].map((tech) => (
                <span 
                  key={tech.name} 
                  className={`${tech.color} px-4 py-2 rounded-full text-sm font-medium shadow-sm hover:scale-105 transition-transform duration-200 cursor-default`}
                >
                  {tech.name}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Преимущества */}
        <div className="mb-16 bg-linear-to-r from-slate-800 to-slate-900 rounded-2xl p-8 text-center">
          <Award className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-white mb-3">Почему выбирают нас?</h3>
          <p className="text-slate-300 max-w-2xl mx-auto">
            Актуальные материалы, практические задания, поддержка и 
            понятная система мотивации - всё для вашего роста
          </p>
        </div>

        {/* Разработчик */}
        <div className="text-center pt-8 border-t border-slate-200">
          <p className="text-slate-500">
            Разработал <span className="font-semibold text-slate-700">Драбеня Павел</span> студент ГГКТТиД
          </p>
          <p className="text-sm text-slate-400 mt-2">Версия 1.0</p>
        </div>
      </div>
    </div>
  )
}

export default AboutPage;