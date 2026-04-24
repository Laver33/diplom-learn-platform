"use client"

import { Button } from "@/components/ui/button"
import {
  Field,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { useRedirectIfAuth } from "@/lib/auth-check"
import { auth, db } from "@/lib/firebase/config"
import { createUserWithEmailAndPassword } from "firebase/auth"
import { doc, setDoc } from "firebase/firestore"
import { Eye, EyeOff, Mail, Lock, UserPlus, ArrowRight } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import toast from "react-hot-toast"

const SignUP = () => {
    useRedirectIfAuth()
    
    const [email, setEmail] = useState<string>("")  
    const [password, setPassword] = useState<string>("")
    const [passwordCopy, setPasswordCopy] = useState<string>("")  
    const [showPassword, setShowPassword] = useState(false)
    const [showPasswordCopy, setShowPasswordCopy] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    const registerCheck = async (e: React.FormEvent) => {
        e.preventDefault();

        if (password !== passwordCopy) {
            toast.error('Пароли не совпадают')
            return
        }

        if (password.length < 6) {
            toast.error('Пароль должен быть минимум 6 символов')
            return
        }

        setIsLoading(true)

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password)
            const user = userCredential.user
            const userUID = user.uid

            const userRef = doc(db, "users", userUID)
            await setDoc(userRef, {  
                email: email,
                name: "",        
                surname: "",  
                role: 'user',
                score: 0,   
                createdAt: new Date().toISOString(),
            })

            toast.success('Аккаунт успешно создан!')
            setEmail("")
            setPassword("")
            setPasswordCopy("")
        } catch (error: any) {
            console.log(error)
            if (error.code === 'auth/email-already-in-use') {
                toast.error('Эта почта уже зарегистрирована')
            } else {
                toast.error('Ошибка при регистрации')
            }
        } finally {
            setIsLoading(false)
        }
    }

    return(
        <div className="relative flex justify-center items-center min-h-screen bg-linear-to-br from-slate-50 via-white to-blue-50/30 overflow-hidden">
            {/* Декоративные элементы фона */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200/30 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-200/30 rounded-full blur-3xl"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-200/20 rounded-full blur-3xl"></div>
            </div>

            <div className="relative z-10 w-full max-w-md px-4">
                <form className="bg-white/80 backdrop-blur-sm shadow-2xl rounded-2xl p-8 border border-slate-200/60 transition-all duration-500 hover:shadow-2xl">
                    {/* Логотип/иконка */}
                    <div className="flex justify-center mb-6">
                        <div className="w-16 h-16 rounded-2xl bg-linear-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-500/25">
                            <UserPlus className="w-8 h-8 text-white" />
                        </div>
                    </div>

                    <h2 className="mb-2 text-2xl font-bold text-center bg-linear-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                        Создание аккаунта
                    </h2>
                    <p className="text-center text-slate-500 text-sm mb-8">
                        Присоединяйся к платформе
                    </p>

                    <div className="space-y-4">
                        <Field>
                            <FieldLabel htmlFor="email" className="text-slate-700 font-medium">Почта</FieldLabel>  
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <Input
                                    id="email" 
                                    type="email"
                                    placeholder="Введите вашу почту"
                                    value={email}  
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="pl-10 border-slate-200 focus:border-blue-400 focus:ring-blue-400"
                                />
                            </div>
                        </Field>

                        <Field>
                            <FieldLabel htmlFor="password" className="text-slate-700 font-medium">Пароль</FieldLabel>  
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <Input
                                    id="password" 
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Введите пароль"
                                    value={password}  
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="pl-10 pr-10 border-slate-200 focus:border-blue-400 focus:ring-blue-400"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                                >
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </Field>

                        <Field>
                            <FieldLabel htmlFor="passwordCopy" className="text-slate-700 font-medium">Повторите пароль</FieldLabel>  
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <Input
                                    id="passwordCopy" 
                                    type={showPasswordCopy ? "text" : "password"}
                                    placeholder="Введите пароль повторно"
                                    value={passwordCopy}  
                                    onChange={(e) => setPasswordCopy(e.target.value)}
                                    className="pl-10 pr-10 border-slate-200 focus:border-blue-400 focus:ring-blue-400"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPasswordCopy(!showPasswordCopy)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                                >
                                    {showPasswordCopy ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </Field>

                        <div className="pt-4 space-y-3">
                            <Button 
                                onClick={registerCheck}
                                disabled={isLoading}
                                className="w-full bg-linear-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold py-2 rounded-xl transition-all duration-300 transform hover:scale-[1.02] shadow-lg shadow-blue-500/30"
                            >
                                {isLoading ? (
                                    <div className="flex items-center gap-2">
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                        <span>Регистрация...</span>
                                    </div>
                                ) : (
                                    <span>Зарегистрироваться</span>
                                )}
                            </Button>
                            
                            <Link href="/signin" className="block">
                                <Button variant="outline" className="w-full border-slate-200 hover:bg-slate-50 hover:border-slate-300 rounded-xl text-slate-700 font-medium">
                                    Уже есть аккаунт? <span className="ml-1 text-blue-600">Войти</span>
                                    <ArrowRight className="w-4 h-4 ml-2" />
                                </Button>
                            </Link>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default SignUP