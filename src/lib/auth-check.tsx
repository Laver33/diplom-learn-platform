import { auth } from "./firebase/config"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export function useRequireAuth(redirectTo = '/signin') {
  const router = useRouter()
  
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) {
        router.push(redirectTo)
      }
    })
    return () => unsubscribe()
  }, [router, redirectTo])
}

export function useRedirectIfAuth(redirectTo = '/') {  
  const router = useRouter()
  
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        router.push(redirectTo)
      }
    })
    return () => unsubscribe()
  }, [router, redirectTo])
}