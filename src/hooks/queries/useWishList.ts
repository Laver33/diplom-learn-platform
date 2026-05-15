'use client'

import { db } from "@/lib/firebase/config"
import { doc, getDoc, collection, getDocs, query, where, documentId } from "firebase/firestore"
import { useQuery } from "@tanstack/react-query"

export interface iCourse {
  id: string
  title: string
  description: string
  direction: string  
  level: string
  duration?: number  
  image?: string
  longDescription?: string
}


export const useUserCourses = (userId: string | undefined) => {
  return useQuery<iCourse[]>({
    queryKey: ['userCourses', userId],    
    queryFn: async () => {

      if (!userId) {
        console.warn('useUserCourses: userId не передан')
        return []
      }

      const userRef = doc(db, "users", userId)
      const userSnap = await getDoc(userRef)

      if (!userSnap.exists()) {
        return []
      }

      const userData = userSnap.data()
      const coursesIds: string[] = userData.coursesArr || []
      
      console.log(`Найдено курсов у пользователя: ${coursesIds.length}`, coursesIds)

      if (coursesIds.length === 0) {
        console.log('У пользователя нет курсов')
        return []
      }

      const coursesRef = collection(db, "courses")
      
      const q = query(coursesRef, where(documentId(), "in", coursesIds))
      
      const snapshot = await getDocs(q)
      
      const coursesData = snapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data() 
      } as iCourse))
            
      return coursesData
    },
    
    enabled: !!userId, // обязательно
    staleTime: 5 * 60 * 1000, 
    gcTime: 10 * 60 * 1000,  
    retry: 1,                
  })
}