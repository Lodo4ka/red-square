import { Button } from '@/shared/ui/button'
import { Input } from '@/shared/ui/input'

export const Login = () => {
  return (
    <form className="space-y-6">
      <div className="space-y-2">
        <label className="block text-lg font-semibold">Имя пользователя:</label>
        <Input placeholder="введите имя пользователя" />
      </div>
      <div className="space-y-2">
        <label className="block text-lg font-semibold">Пароль:</label>
        <Input type="password" placeholder="введите пароль" />
      </div>
      <Button className="w-full h-12 text-lg" variant='ghost'>Войти</Button>
    </form>
  )
}
