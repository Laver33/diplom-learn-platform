"use client"

import { useParams } from "next/navigation";
import { useCourse } from "@/hooks/queries/useCourse";
import { useUserStore } from "@/app/store/userStore";
import { CertificateGenerator } from "@/components/CertificateGenerator";
import { auth, db } from "@/lib/firebase/config";
import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";

const CertificatePage = () => {
  const { courseId } = useParams();
  const { data: course, isLoading } = useCourse(courseId as string);
  const { user_name } = useUserStore();
  const [isCompleted, setIsCompleted] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkCompletion = async () => {
      const userId = auth.currentUser?.uid;
      if (!userId) return;
      const userRef = doc(db, 'users', userId);
      const snap = await getDoc(userRef);
      const progress = snap.data()?.courseProgress?.[courseId as string];
      setIsCompleted(progress?.testPassed === true);
      setLoading(false);
    };
    checkCompletion();
  }, [courseId]);

  if (isLoading || loading) return <div className="p-8 text-center">Загрузка...</div>;
  if (!isCompleted) {
    return (
      <div className="p-8 text-center">
        <p className="text-red-500">Вы ещё не завершили этот курс.</p>
        <p className="text-gray-500 mt-2">Пройдите тест, чтобы получить сертификат.</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <CertificateGenerator
        courseTitle={course?.title || 'Курс'}
        courseId={courseId as string}
        userName={user_name}
        date={new Date().toISOString()}
      />
    </div>
  );
};

export default CertificatePage;