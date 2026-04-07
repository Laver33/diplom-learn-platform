import { create } from 'zustand'

interface UserState {
    user_name: string
    user_surname: string,

    // Для статистики
    user_test_count: number,
    user_courses_start_count: number,
    user_courses_completed_count: number,
    user_lvl: number,

    // Функции
    setUsername: (name: string) => void
    setUsersurname: (surname: string) => void


}

export const useUserStore = create<UserState>()(
    (set) => ({
        user_name: 'Имя',
        user_surname: 'Фамилия',

        // Для статистики
        user_test_count: 0,
        user_courses_start_count: 0,
        user_courses_completed_count: 0,
        user_lvl: 0,

        // Функции
        setUsername: (name) => set({ user_name: name }),
        setUsersurname: (surname) => set({ user_surname: surname }),
    }),
    
)