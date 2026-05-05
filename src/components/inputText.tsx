import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

const InputText = (props: { 
    value: string | number, place: string, titleField: string, maxLength?: number
    setFunc: (value: string) => void}) => {
    return(
        <Field>
            <FieldLabel>{props.titleField}</FieldLabel>  
            <Input
                maxLength={props.maxLength ?? undefined}
                id="userName" 
                placeholder={props.place}
                type="text"
                value={props.value}
                onChange={(e) => props.setFunc(e.target.value)}  
            />
        </Field>
    )
}

export default InputText;