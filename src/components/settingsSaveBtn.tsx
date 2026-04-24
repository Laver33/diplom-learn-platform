import { Button } from "./ui/button"



const SettingsSaveIcon = (props: {funcBtn: () => {}, title:string }) => {
    return(
    
    <div className="btn flex justify-end">
        <Button 
            className="p-4 mt-6 justify-end" 
            onClick={props.funcBtn}
        >
            {props.title}</Button>
    </div>

    )
}

export default SettingsSaveIcon;