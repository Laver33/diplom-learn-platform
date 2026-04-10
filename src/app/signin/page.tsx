"use client"

import { Button } from "@/components/ui/button"
import {
  Field,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { useRedirectIfAuth } from "@/lib/auth-check"
import { auth } from "@/lib/firebase/config"
import { signInWithEmailAndPassword } from "firebase/auth"
import Link from "next/link"
import { useState } from "react"
import toast from "react-hot-toast"


const SignIn = () => {
    useRedirectIfAuth()
    
    
    const [email, setEmail] = useState<string>("")  
    const [password, setPassword] = useState<string>("")
    const [error, setError] = useState(false);

    const login = async (e: any) => {
        e.preventDefault();


        if (password.length < 6){
            toast.error('Пароль должен быть минимум 6 символов')
            return
        }




        signInWithEmailAndPassword(auth, email, password).then((user) => {
            toast.success('Успешно')
            console.log(user);
            setEmail("");
            setPassword("");
        }).catch((error) => console.log(error))
    }

    return(
        <div className="flex justify-center items-center min-h-screen">
            <form className="w-72 grid gap-2.5 shadow-xl p-6 rounded">
                <h2 className="mb-2 flex justify-center text-xl">Вход в аккаунт</h2>

                <Field>
                    <FieldLabel htmlFor="email">Почта</FieldLabel>  
                    <Input
                        id="email" 
                        type="email"
                        placeholder="Введите вашу почту"
                        value={email}  
                        onChange={(e) => setEmail(e.target.value)} 
                    />
                </Field>

                <Field>
                    <FieldLabel htmlFor="password">Пароль</FieldLabel>  
                    <Input
                        id="password" 
                        type="password"
                        placeholder="Введите пароль"
                        value={password}  
                        onChange={(e) => setPassword(e.target.value)}  
                    />
                </Field>

                <div className="btn flex justify-center gap-2 mt-2">
                    {error ? <p className="text-red-500">Ошибка</p> : null}
                    <Link href="/signup" className="w-full">
                        <Button variant="outline">Зарегистрироваться</Button>
                    </Link>
                    
                    <Button variant="outline" onClick={login}>Войти</Button>
                    
                </div>
            </form>
        </div>
    )
}

export default SignIn