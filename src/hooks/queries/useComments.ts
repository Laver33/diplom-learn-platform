'use client'

import { db } from '@/lib/firebase/config'
import { collection, query, orderBy, getDocs, addDoc, deleteDoc, doc, where } from 'firebase/firestore'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { auth } from '@/lib/firebase/config'

export interface IComment {
  id: string
  courseId: string
  userId: string
  userName: string
  text: string
  rating: number
  createdAt: string
}

export const useComments = (courseId: string) => {
  return useQuery<IComment[]>({
    queryKey: ['comments', courseId],
    queryFn: async () => {
      const commentsRef = collection(db, 'courses', courseId, 'comments')
      const q = query(commentsRef, orderBy('createdAt', 'desc'))
      const snapshot = await getDocs(q)
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as IComment))
    },
    enabled: !!courseId,
  })
}

export const useAddComment = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ courseId, text, rating }: { courseId: string; text: string; rating: number }) => {
      const user = auth.currentUser
      if (!user) throw new Error('Не авторизован')
      
      const commentsRef = collection(db, 'courses', courseId, 'comments')
      await addDoc(commentsRef, {
        courseId,
        userId: user.uid,
        userName: user.displayName || 'Аноним',
        text,
        rating,
        createdAt: new Date().toISOString(),
      })
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['comments', variables.courseId] })
    },
  })
}

export const useDeleteComment = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ courseId, commentId }: { courseId: string; commentId: string }) => {
      await deleteDoc(doc(db, 'courses', courseId, 'comments', commentId))
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['comments', variables.courseId] })
    },
  })
}