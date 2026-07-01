"use client"

import { useState } from "react";
import { storage } from "@/lib/firebase/config"; 
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "react-hot-toast";
import { Upload, X } from "lucide-react";

interface ImageUploadProps {
  onUpload: (url: string) => void;
  folder: string;
  label?: string;
}

export const ImageUpload = ({ onUpload, folder, label = "Загрузить изображение" }: ImageUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Проверка размера и типа
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Файл не должен превышать 5 МБ');
      return;
    }
    if (!file.type.startsWith('image/')) {
      toast.error('Разрешены только изображения');
      return;
    }

    setUploading(true);
    try {
      const storageRef = ref(storage, `${folder}/${Date.now()}_${file.name}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      setPreview(url);
      onUpload(url);
      toast.success('Изображение загружено');
    } catch (error) {
      console.error('Ошибка загрузки:', error);
      toast.error('Ошибка загрузки');
    } finally {
      setUploading(false);
    }
  };

  const clearPreview = () => {
    setPreview(null);
    onUpload('');
  };

  return (
    <div className="space-y-4">
      {preview ? (
        <div className="relative w-48 h-32 rounded-lg overflow-hidden border">
          <img src={preview} alt="Preview" className="w-full h-full object-cover" />
          <button
            onClick={clearPreview}
            className="absolute top-2 right-2 bg-black/50 text-white rounded-full p-1 hover:bg-black/70"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div className="border-2 border-dashed rounded-lg p-8 text-center">
          <Upload className="w-8 h-8 mx-auto text-gray-400" />
          <p className="text-sm text-gray-500 mt-2">{label}</p>
          <Input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            disabled={uploading}
            className="mt-2"
          />
          {uploading && <p className="text-sm text-blue-500 mt-2">Загрузка...</p>}
        </div>
      )}
    </div>
  );
};