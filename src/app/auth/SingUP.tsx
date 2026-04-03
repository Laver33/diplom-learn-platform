"use client"

import {
  Field,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { useState } from "react"

const SignUP = () => {
    const [email, setEmail] = useState<string>("")  // ← добавил тип и значение по умолчанию

    return(
        <div>
            <form>
                <h2>Создание аккаунта</h2>

                <Field>
                    <FieldLabel htmlFor="email">Email</FieldLabel>  {/* ← исправил htmlFor и текст */}
                    <Input
                        id="email" 
                        type="email"
                        placeholder="Enter your email"
                        value={email}  // ← связали с состоянием
                        onChange={(e) => setEmail(e.target.value)}  // ← обработчик изменений
                    />
                </Field>

            </form>
        </div>
    )
}

export default SignUP