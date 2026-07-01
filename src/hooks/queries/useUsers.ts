'use client'

import { db } from '@/lib/firebase/config'
import { collection, getDocs } from 'firebase/firestore'
import { useQuery } from '@tanstack/react-query'

export interface IUser {
  id: string
  email: string
  name: string
  surname: string
  role: 'user' | 'admin'
  score: number
  createdAt: string
}

export const useUsers = () => {
  return useQuery<IUser[]>({
    queryKey: ['users'],
    queryFn: async () => {
      const usersRef = collection(db, 'users')
      const snapshot = await getDocs(usersRef)
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as IUser))
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 1,
  })
}