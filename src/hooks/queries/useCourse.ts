'use client'

import { db } from "@/lib/firebase/config"
import { doc, getDoc } from "firebase/firestore"  
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

export const useCourse = (id: string | undefined) => {
  return useQuery<iCourse | null>({
    queryKey: ['course', id],
    queryFn: async () => {
      if (!id) return null
      
      const courseRef = doc(db, "courses", id)
      const snapshot = await getDoc(courseRef)
      
      if (!snapshot.exists()) {
        return null
      }
      
      return {
        id: snapshot.id,
        ...snapshot.data()
      } as iCourse
    },
    enabled: !!id 
  })
}