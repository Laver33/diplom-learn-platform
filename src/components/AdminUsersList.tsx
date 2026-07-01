'use client'

import { useUsers } from '@/hooks/queries/useUsers'
import { db } from '@/lib/firebase/config'
import { doc, updateDoc, deleteDoc } from 'firebase/firestore'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { toast } from 'react-hot-toast'
import { Trash2, UserCog, RefreshCw } from 'lucide-react'

export const AdminUsersList = () => {
  const { data: users, isLoading, error, refetch } = useUsers()
  const queryClient = useQueryClient()

  const updateRole = useMutation({
    mutationFn: async ({ userId, newRole }: { userId: string; newRole: 'user' | 'admin' }) => {
      const userRef = doc(db, 'users', userId)
      await updateDoc(userRef, { role: newRole })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
      toast.success('Роль обновлена')
    },
    onError: () => toast.error('Ошибка обновления роли'),
  })

  const deleteUser = useMutation({
    mutationFn: async (userId: string) => {
      // Внимание: удаление пользователя из Authentication не входит в эту функцию,
      // но можно добавить отдельно через Admin SDK (на сервере). 
      // Здесь удаляем только документ Firestore – это безопаснее, 
      // но учтите, что аккаунт останется в Auth. Для полноты можно 
      // написать Cloud Function, но пока оставим так.
      await deleteDoc(doc(db, 'users', userId))
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
      toast.success('Пользователь удалён')
    },
    onError: () => toast.error('Ошибка удаления'),
  })

  if (isLoading) return <div className="p-4">Загрузка пользователей...</div>
  if (error) return <div className="p-4 text-red-500">Ошибка загрузки</div>

  return (
    <div className="overflow-x-auto">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Все пользователи ({users?.length || 0})</h3>
        <Button variant="outline" onClick={() => refetch()} disabled={isLoading}>
          <RefreshCw className="w-4 h-4 mr-2" />
          Обновить
        </Button>
      </div>
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="bg-gray-50">
            <th className="p-3 text-left">Email</th>
            <th className="p-3 text-left">Имя</th>
            <th className="p-3 text-left">Фамилия</th>
            <th className="p-3 text-left">Роль</th>
            <th className="p-3 text-left">Действия</th>
          </tr>
        </thead>
        <tbody>
          {users?.map((user) => (
            <tr key={user.id} className="border-t hover:bg-gray-50">
              <td className="p-3">{user.email}</td>
              <td className="p-3">{user.name || '—'}</td>
              <td className="p-3">{user.surname || '—'}</td>
              <td className="p-3">
                <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                  {user.role}
                </Badge>
              </td>
              <td className="p-3 flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    updateRole.mutate({
                      userId: user.id,
                      newRole: user.role === 'admin' ? 'user' : 'admin',
                    })
                  }
                  disabled={updateRole.isPending}
                >
                  <UserCog className="w-3 h-3 mr-1" />
                  {user.role === 'admin' ? 'Снять' : 'Назначить'}
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => deleteUser.mutate(user.id)}
                  disabled={deleteUser.isPending}
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}