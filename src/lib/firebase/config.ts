import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Конфигурация
const firebaseConfig = {
  apiKey: "AIzaSyCmfu0aN7E5foR7tpW3zmQXrmjVBZNdH9Q",
  authDomain: "diplom-platform.firebaseapp.com",
  projectId: "diplom-platform",
  storageBucket: "diplom-platform.firebasestorage.app",
  messagingSenderId: "716804061538",
  appId: "1:716804061538:web:64b19d385820f2a207943b"
};

// инициализация
const app = initializeApp(firebaseConfig);


// Авторизация
export const auth = getAuth(app);