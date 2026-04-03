"use client"

import { Button } from "@/components/ui/button"
import {
  Field,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { auth } from "@/lib/firebase/config"
import { createUserWithEmailAndPassword } from "firebase/auth"
import Link from "next/link"
import { useState } from "react"
import toast from "react-hot-toast"


const SignUP = () => {
    const [email, setEmail] = useState<string>("")  
    const [password, setPassword] = useState<string>("")
    const [passwordCopy, setPasswordCopy] = useState<string>("")  
    const [error, setError] = useState(false);

    const registerCheck = (e: any) => {
        e.preventDefault();

        if (password != passwordCopy){
            toast.error('Проблема с совпадением паролей')
            return
        }

        if (password.length < 6){
            toast.error('Пароль должен быть минимум 6 символов')
            return
        }

        createUserWithEmailAndPassword(auth, email, password).then((user) => {
            toast.success('Успешно')
            console.log(user);
            setEmail("");
            setPassword("");
            setPasswordCopy("");
        }).catch((error) => console.log(error))
    }

    return(
        <div className="flex justify-center items-center min-h-screen">
            <form className="w-72 grid gap-2.5 shadow-xl p-6 rounded">
                <h2 className="mb-2 flex justify-center text-xl">Создание аккаунта</h2>

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

                <Field>
                    <FieldLabel htmlFor="password">Повторите пароль</FieldLabel>  
                    <Input
                        id="passwordCopy" 
                        type="password"
                        placeholder="Введите пароль повторно"
                        value={passwordCopy}  
                        onChange={(e) => setPasswordCopy(e.target.value)} 
                    />
                </Field>

                <div className="btn flex justify-center gap-2 mt-2">
                    {error ? <p className="text-red-500">Ошибка</p> : null}
                    <Button variant="outline" onClick={registerCheck}>Зарегистрироваться</Button>
                    
                    <Link href="/signin" className="w-full">
                        <Button variant="outline" >Войти</Button>
                    </Link>
                    
                    
                </div>
            </form>
        </div>
    )
}

export default SignUP