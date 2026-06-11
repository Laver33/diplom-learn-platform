"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { sendPasswordResetEmail } from "firebase/auth"
import { auth } from "@/lib/firebase/config"
import toast from "react-hot-toast"
import { Mail, ArrowLeft, CheckCircle, X } from "lucide-react"

interface ForgotPasswordModalProps {
    isOpen: boolean
    onClose: () => void
}

export function ForgotPasswordModal({ isOpen, onClose }: ForgotPasswordModalProps) {
    const [email, setEmail] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [isSent, setIsSent] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        
        if (!email) {
            toast.error('Введите email')
            return
        }

        setIsLoading(true)
        
        try {
            await sendPasswordResetEmail(auth, email, {
                url: `${window.location.origin}/signin`,
                handleCodeInApp: false
            })
            
            setIsSent(true)
            toast.success('Письмо отправлено! Проверьте почту')
            
        } catch (error: any) {
            console.log(error)
            
            if (error.code === 'auth/user-not-found') {
                toast.error('Пользователь с таким email не найден')
            } else if (error.code === 'auth/invalid-email') {
                toast.error('Неверный формат email')
            } else if (error.code === 'auth/too-many-requests') {
                toast.error('Слишком много попыток. Попробуйте позже')
            } else {
                toast.error('Ошибка при отправке письма')
            }
        } finally {
            setIsLoading(false)
        }
    }

    const handleClose = () => {
        setEmail("")
        setIsSent(false)
        onClose()
    }

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-md bg-white/95 backdrop-blur-sm border-slate-200/60 shadow-2xl">
                
                {/* Кнопка закрытия */}
                <button
                    onClick={handleClose}
                    className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none"
                >
                    <X className="h-4 w-4" />
                    <span className="sr-only">Close</span>
                </button>

                {!isSent ? (
                    <>
                        <DialogHeader className="text-center">
                            <div className="flex justify-center mb-4">
                                <div className="w-16 h-16 rounded-2xl bg-linear-to-br from-orange-500 to-red-500 flex items-center justify-center shadow-lg shadow-orange-500/25">
                                    <Mail className="w-8 h-8 text-white" />
                                </div>
                            </div>
                            <DialogTitle className="text-2xl font-bold bg-linear-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                                Восстановление пароля
                            </DialogTitle>
                            <p className="text-slate-500 text-sm mt-2">
                                Введите email, и мы отправим ссылку для сброса пароля
                            </p>
                        </DialogHeader>

                        <form onSubmit={handleSubmit} className="space-y-6 mt-6">
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <Input
                                    type="email"
                                    placeholder="example@mail.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="pl-10 border-slate-200 focus:border-orange-400 focus:ring-orange-400 h-11"
                                    required
                                    autoFocus
                                />
                            </div>
                            
                            <div className="space-y-3">
                                <Button 
                                    type="submit" 
                                    disabled={isLoading}
                                    className="w-full bg-linear-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold h-11 rounded-xl transition-all duration-300 transform hover:scale-[1.02] shadow-lg shadow-orange-500/30"
                                >
                                    {isLoading ? (
                                        <div className="flex items-center gap-2">
                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                            <span>Отправка...</span>
                                        </div>
                                    ) : (
                                        <span>Отправить письмо</span>
                                    )}
                                </Button>
                                
                                <Button 
                                    type="button"
                                    variant="outline" 
                                    onClick={handleClose}
                                    className="w-full border-slate-200 hover:bg-slate-50 h-11 rounded-xl"
                                >
                                    <ArrowLeft className="w-4 h-4 mr-2" />
                                    Вернуться к входу
                                </Button>
                            </div>
                        </form>
                    </>
                ) : (
                    <>
                        <DialogHeader className="text-center">
                            <div className="flex justify-center mb-4">
                                <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center animate-in zoom-in duration-300">
                                    <CheckCircle className="w-10 h-10 text-green-600" />
                                </div>
                            </div>
                            <DialogTitle className="text-2xl font-bold text-slate-800">
                                Письмо отправлено!
                            </DialogTitle>
                            <div className="space-y-2 mt-4">
                                <p className="text-slate-600">
                                    Мы отправили инструкцию по восстановлению на
                                </p>
                                <p className="font-medium text-orange-600 bg-orange-50 p-2 rounded-lg">
                                    {email}
                                </p>
                                <p className="text-slate-500 text-sm mt-4">
                                    Перейдите по ссылке в письме, чтобы создать новый пароль
                                </p>
                            </div>
                        </DialogHeader>

                        <div className="space-y-3 mt-6">
                            <Button 
                                onClick={handleClose}
                                className="w-full bg-linear-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
                            >
                                Закрыть
                            </Button>
                        </div>
                    </>
                )}
            </DialogContent>
        </Dialog>
    )
}