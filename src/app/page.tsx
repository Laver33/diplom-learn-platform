

"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function Home() {
  const router = useRouter()
  
  useEffect(() => {
    router.push('/signup')
  }, [router])
  
  return (
    <div className="flex justify-center items-center min-h-screen">
      <p>Загрузка...</p>
    </div>
  )
}