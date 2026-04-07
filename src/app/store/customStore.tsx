import { create } from 'zustand'

interface CustomState {
    card_statistic_color: string
    
    setCardStatisticColor: (color: string) => void
}

export const useCustomStore = create<CustomState>()(
    (set) => ({
        card_statistic_color: 'white',

        // Функции
        setCardStatisticColor: (color) => set({ card_statistic_color: color }),
    }),
    
)