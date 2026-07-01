'use client'

import { useState } from 'react'
import PagesTitle from '@/components/pagesTitle'
import MainDescription from '@/components/mainDescription'
import { AdminUsersList } from '@/components/AdminUsersList'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Users, BookOpen, UserCog } from 'lucide-react'

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState<'info' | 'users' | 'courses'>('info')

  return (
    <div>
      <PagesTitle title="Админ-панель" />
      <MainDescription description="Панель управления платформой" />

      {/* Вкладки */}
      <div className="flex gap-2 mt-6 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('info')}
          className={`px-4 py-2 font-medium ${activeTab === 'info' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600'}`}
        >
          <UserCog className="w-4 h-4 inline mr-1" />
          Информация
        </button>
        <button
          onClick={() => setActiveTab('users')}
          className={`px-4 py-2 font-medium ${activeTab === 'users' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600'}`}
        >
          <Users className="w-4 h-4 inline mr-1" />
          Пользователи
        </button>
        <button
          onClick={() => setActiveTab('courses')}
          className={`px-4 py-2 font-medium ${activeTab === 'courses' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600'}`}
        >
          <BookOpen className="w-4 h-4 inline mr-1" />
          Курсы
        </button>
      </div>

      {/* Содержимое вкладок */}
      <div className="mt-6">
        {activeTab === 'info' && (
          <div className="p-6 bg-white rounded-xl border">
            <h3 className="text-lg font-semibold">Информация об аккаунте</h3>
            {/* Здесь можно оставить ваш существующий блок с данными пользователя */}
            <p className="text-gray-500 mt-2">Здесь отображается информация о текущем администраторе.</p>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="p-6 bg-white rounded-xl border">
            <AdminUsersList />
          </div>
        )}

        {activeTab === 'courses' && (
          <div className="p-6 bg-white rounded-xl border">
            <div className="flex items-center gap-4">
              <p className="text-gray-700">Добавить новый курс</p>
              <Link href="/adminpanel/addcourses">
                <Button className="bg-blue-600 hover:bg-blue-700">Добавить</Button>
              </Link>
            </div>
            {/* Можно также вывести список существующих курсов для редактирования */}
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminPanel