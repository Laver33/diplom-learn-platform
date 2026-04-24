import { useUserStore } from "@/app/store/userStore";

const MainWelcome = () => {
    const userName = useUserStore((state) => state.user_name)

    return(
        <div className="flex items-center gap-4 mb-2">
            <div className="w-12 h-12 rounded-2xl bg-linear-to-r from-blue-500 to-cyan-500 flex items-center justify-center text-2xl shadow-lg shadow-blue-500/25">
                👋
            </div>
            <div>
                <h2 className="text-3xl font-bold text-slate-800">
                    Приветствую тебя, <span className="bg-linear-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">{userName}</span>
                </h2>
                <p className="text-slate-500 text-sm mt-1">С возвращением на платформу!</p>
            </div>
        </div>
    )
}

export default MainWelcome;