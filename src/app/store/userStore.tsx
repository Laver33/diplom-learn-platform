import { create } from 'zustand'

interface UserState {
    user_name: string
    user_surname: string,
    setUsername: (name: string) => void
    setUsersurname: (surname: string) => void
}

export const useUserStore = create<UserState>()(
    (set) => ({
        user_name: 'Имя',
        user_surname: 'Фамилия',

        // Функции
        setUsername: (name) => set({ user_name: name }),
        setUsersurname: (surname) => set({ user_surname: surname }),
    }),
    
)