"use client"

import { useUserStore } from "@/app/store/userStore";
import { Button } from "@/components/ui/button";
import { Award, Download } from "lucide-react";
import { jsPDF } from "jspdf";
import { useRouter } from "next/navigation";

interface CertificateProps {
  courseTitle: string;
  courseId: string;
  userName: string;
  date: string;
}

export const CertificateGenerator = ({ courseTitle, courseId, userName, date }: CertificateProps) => {
  const router = useRouter();

  const generatePDF = () => {
    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4',
    });

    // Фон
    doc.setFillColor(245, 245, 255);
    doc.rect(0, 0, 297, 210, 'F');

    // Рамка
    doc.setDrawColor(100, 149, 237);
    doc.setLineWidth(2);
    doc.rect(10, 10, 277, 190);

    // Заголовок
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(40);
    doc.setTextColor(30, 30, 150);
    doc.text('СЕРТИФИКАТ', 148.5, 60, { align: 'center' });

    // Текст
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(18);
    doc.setTextColor(50, 50, 50);
    doc.text('Настоящий сертификат подтверждает, что', 148.5, 85, { align: 'center' });

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(28);
    doc.setTextColor(0, 0, 0);
    doc.text(userName || 'Участник', 148.5, 110, { align: 'center' });

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(18);
    doc.setTextColor(50, 50, 50);
    doc.text(`успешно завершил(а) курс "${courseTitle}"`, 148.5, 135, { align: 'center' });

    doc.setFontSize(14);
    doc.setTextColor(100, 100, 100);
    doc.text(`Дата выдачи: ${new Date(date).toLocaleDateString('ru-RU')}`, 148.5, 165, { align: 'center' });

    // ID сертификата
    doc.setFontSize(10);
    doc.setTextColor(150, 150, 150);
    doc.text(`Сертификат №: ${courseId.slice(0, 8)}-${Date.now().toString().slice(-6)}`, 148.5, 190, { align: 'center' });

    doc.save(`certificate-${courseId}.pdf`);
  };

  return (
    <div className="flex flex-col items-center gap-4 p-6 bg-white rounded-xl border border-gray-200 shadow-lg">
      <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
        <Award className="w-8 h-8 text-blue-600" />
      </div>
      <h3 className="text-xl font-bold text-gray-800">Поздравляем!</h3>
      <p className="text-gray-600 text-center">
        Вы успешно завершили курс <span className="font-semibold">«{courseTitle}»</span>
      </p>
      <Button onClick={generatePDF} className="gap-2">
        <Download className="w-4 h-4" />
        Скачать сертификат (PDF)
      </Button>
    </div>
  );
};