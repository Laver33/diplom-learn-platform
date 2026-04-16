import { db } from "@/lib/firebase/config";
import { collection, query, where, getDocs } from "firebase/firestore";

const useFetchRole = () => {
    
    
    const fetchData = async () => {
        try {
            
            const querySnapshot = await getDocs(collection(db, "users"));
            

        } finally {

        }
    }


}