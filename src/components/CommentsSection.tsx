'use client'

import { useState } from 'react'
import { useComments, useAddComment, useDeleteComment } from '@/hooks/queries/useComments'
import { useUserStore } from '@/app/store/userStore'
import { Button } from '@/components/ui/button'
import { toast } from 'react-hot-toast'
import { Trash2, Star } from 'lucide-react'
import { auth } from '@/lib/firebase/config'

interface CommentsSectionProps {
  courseId: string
}

export const CommentsSection = ({ courseId }: CommentsSectionProps) => {
  const { data: comments, isLoading } = useComments(courseId)
  const addComment = useAddComment()
  const deleteComment = useDeleteComment()
  const { user_name } = useUserStore()
  const [text, setText] = useState('')
  const [rating, setRating] = useState(5)
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async () => {
    if (!text.trim()) {
      toast.error('Введите текст комментария')
      return
    }
    setSubmitting(true)
    try {
      await addComment.mutateAsync({ courseId, text, rating })
      setText('')
      setRating(5)
      toast.success('Комментарий добавлен')
    } catch (error) {
      toast.error('Ошибка при добавлении')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (commentId: string) => {
    if (confirm('Удалить комментарий?')) {
      await deleteComment.mutateAsync({ courseId, commentId })
    }
  }

  if (isLoading) return <div className="p-4 text-center text-gray-500">Загрузка комментариев...</div>

  return (
    <div className="mt-8 p-6 bg-white rounded-xl border border-gray-200">
      <h3 className="text-xl font-bold text-gray-800 mb-4">💬 Отзывы ({comments?.length || 0})</h3>

      {/* Форма добавления */}
      <div className="space-y-4 mb-6 p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center gap-4">
          <span className="font-medium">Оценка:</span>
          <div className="flex gap-1">
            {[1,2,3,4,5].map((star) => (
              <button
                key={star}
                onClick={() => setRating(star)}
                className="focus:outline-none"
              >
                <Star
                  className={`w-6 h-6 ${
                    star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                  }`}
                />
              </button>
            ))}
          </div>
        </div>
        <textarea
          placeholder="Поделитесь впечатлениями о курсе..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={3}
        />
        <Button
          onClick={handleSubmit}
          disabled={submitting || !text.trim()}
          className="bg-blue-600 hover:bg-blue-700"
        >
          {submitting ? 'Отправка...' : 'Отправить отзыв'}
        </Button>
      </div>

      {/* Список комментариев */}
      <div className="space-y-4">
        {comments?.length === 0 && (
          <p className="text-gray-500 text-center py-4">Пока нет отзывов. Будьте первым!</p>
        )}
        {comments?.map((comment) => (
          <div key={comment.id} className="border-b border-gray-100 pb-3 last:border-0">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-semibold text-gray-800">{comment.userName}</p>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <div className="flex">
                    {[1,2,3,4,5].map((star) => (
                      <Star
                        key={star}
                        className={`w-4 h-4 ${
                          star <= comment.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span>• {new Date(comment.createdAt).toLocaleDateString('ru-RU')}</span>
                </div>
              </div>
              {/* Кнопка удаления – только если пользователь автор или админ */}
              {auth.currentUser?.uid === comment.userId && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(comment.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              )}
            </div>
            <p className="mt-1 text-gray-700">{comment.text}</p>
          </div>
        ))}
      </div>
    </div>
  )
}