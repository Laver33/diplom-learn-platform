import { useUserStore } from "@/app/store/userStore";



const MainWelcome = () => {
    const userName = useUserStore((state) => state.user_name)

    return(
        <>
            <h2 className="text-2xl text-black">Приветствую тебя, {userName} 👋</h2>
        </>
    )
}

export default MainWelcome;