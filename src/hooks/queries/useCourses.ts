'use client'

import { db } from "@/lib/firebase/config"
import { collection, getDocs } from "firebase/firestore"
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

export const useCourses = () => {
  return useQuery<iCourse[]>({  
    queryKey: ["courses"],
    queryFn: async () => {
      const snapshot = await getDocs(collection(db, "courses"))
      const data = snapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data() 
      } as iCourse))  
      console.log("Загруженные курсы:", data)
      return data
    }
  })
}