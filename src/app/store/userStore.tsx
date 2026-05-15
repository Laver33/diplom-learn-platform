import { auth, db } from '@/lib/firebase/config';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { create } from 'zustand'

interface UserState {
    user_name: string
    user_surname: string,
    user_score: number,
    user_email: string,

    // Для статистики
    user_test_count: number,
    user_courses_start_count: number,
    user_courses_completed_count: number,
    user_lvl: number,

    //Загрузка
    isLoading: boolean,

    // Функции
    setUsername: (name: string) => void
    setUsersurname: (surname: string) => void

    // Для работы с БД ( FireStore )
    fetchUserData: () => Promise<void>;  
    updateUserName: (name: string) => Promise<void>;  
    updateUserSurname: (surname: string) => Promise<void>; 
    updateUserScore: (score: number) => Promise<void>;     
    updateUserEmail: (email: string) => Promise<void>;     
}

export const useUserStore = create<UserState>()(
    (set) => ({
        // Данные пользователя
        user_name: 'Имя',
        user_surname: 'Фамилия',
        user_score: 0,
        user_email: '',

        // Для статистики
        user_test_count: 0,
        user_courses_start_count: 0,
        user_courses_completed_count: 0,
        user_lvl: 0,

        isLikeCourse: false,
        isLoading: true,

        // Функции
        setUsername: (name) => set({ user_name: name }),
        setUsersurname: (surname) => set({ user_surname: surname }),



        // Для работы с БД ( FireStore ), данные
        fetchUserData: async () => {
            set({ isLoading: true });
            

            try {
                const currentUser = auth.currentUser;
                
                if (!currentUser) {
                    console.log('Пользователь не авторизован');
                    set({ isLoading: false });
                    return;
                }
                
                // док ссылка
                const userRef = doc(db, 'users', currentUser.uid);
                const docSnap = await getDoc(userRef);
                
                if (docSnap.exists()) {
                    const data = docSnap.data();
                    set({
                        user_name: data.name || '',
                        user_surname: data.surname || '',
                        user_score: data.score || 0,
                        user_email: data.email || '',
                        isLoading: false,
                    });
                    console.log('Данные пользователя загружены:', data);
                } else {
                    console.log('Документ пользователя не найден');
                    set({ isLoading: false });
                }
            } catch (error) {
                console.error('Ошибка загрузки данных:', error);
                set({ isLoading: false });
            }
        },

        // Фамилия
        updateUserSurname: async (surname: string) => {
            try {
                const currentUser = auth.currentUser;
                if (!currentUser) return;
                
                const userRef = doc(db, 'users', currentUser.uid);
                await updateDoc(userRef, { surname });
                
                set({ user_surname: surname });
                console.log('Фамилия обновлена:', surname);
            } catch (error) {
                console.error('Ошибка обновления фамилии:', error);
            }
        },

        // Почта
        updateUserEmail: async (email: string) => {
            try {
                const currentUser = auth.currentUser;
                if (!currentUser) return;
                
                const userRef = doc(db, 'users', currentUser.uid);
                await updateDoc(userRef, { email });
                
                set({ user_email: email });
                console.log('Почта обновлена:', email);
            } catch (error) {
                console.error('Ошибка обновления почты:', error);
            }
        },



        // Имя
        updateUserName: async (name: string) => {
            try {
                const currentUser = auth.currentUser;
                if (!currentUser) return;
                
                const userRef = doc(db, 'users', currentUser.uid);
                await updateDoc(userRef, { name });
                
                // Обновляем локальное состояние
                set({ user_name: name });
                console.log('Имя обновлено:', name);
            } catch (error) {
                console.error('Ошибка обновления имени:', error);
            }
        },
        
        
        // Счет
        updateUserScore: async (score: number) => {
            try {
                const currentUser = auth.currentUser;
                if (!currentUser) return;
                
                const userRef = doc(db, 'users', currentUser.uid);
                await updateDoc(userRef, { score });
                
                set({ user_score: score });
                console.log('Счёт обновлён:', score);
            } catch (error) {
                console.error('Ошибка обновления счёта:', error);
            }
        },
        
    }),
    
)