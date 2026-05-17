import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

const InputLessons = (props: { 
    valueTitle: string | number, 
    titleFieldTitle: string, 
    inputClassNameTitle?: string,

    valueLesson: string | number, 
    titleFieldLesson: string, 
    inputClassNameLesson?: string,

    setFuncTitle: (value: string) => void,  
    setFuncLesson: (value: string) => void 

}) => {    

    return(
        <div className="flex gap-4 items-start w-full">
            <div className="w-1/3">
                <Field>
                    <FieldLabel>{props.titleFieldTitle}</FieldLabel>  
                    <Input
                        className={props.inputClassNameTitle}
                        maxLength={20}
                        id="userName" 
                        placeholder={'Название урока'}
                        type="text"
                        value={props.valueTitle}
                        onChange={(e) => props.setFuncTitle(e.target.value)}  
                    />
                </Field>
            </div>

            <div className="w-2/3">
                <Field>
                    <FieldLabel>Контент урока</FieldLabel>  
                    <Input
                        className={props.inputClassNameLesson}
                        maxLength={5000}
                        id="userName" 
                        placeholder={'Контент урока'}
                        type="text"
                        value={props.valueLesson}
                        onChange={(e) => props.setFuncLesson(e.target.value)}  
                    />
                </Field>
            </div>
        </div>
    )
}

export default InputLessons;