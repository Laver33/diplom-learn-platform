'use client'

import { db } from "@/lib/firebase/config"
import { collection, getDocs, query, where } from "firebase/firestore"  
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

export const useCourses = (category: string) => {  
  return useQuery<iCourse[]>({
    queryKey: ['courses', category],  
    queryFn: async () => {

      let coursesRef = collection(db, "courses")
      
      let qDirection;
      if (category && category !== 'all') {
        qDirection = query(coursesRef, where("type", "==", category))
      } else {
        qDirection = query(coursesRef)  
      }
      
      const snapshot = await getDocs(qDirection)
      const data = snapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data() 
      } as iCourse))
      
      console.log(`Загруженные курсы (${category || "все"}):`, data)
      return data
    }
  })
}