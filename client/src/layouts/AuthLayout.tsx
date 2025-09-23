import { Outlet } from 'react-router-dom'
import { Card } from '@/shared/ui/Card/Card'
import { CardHeader } from '@/shared/ui/Card/CardHeader'
import { CardTitle } from '@/shared/ui/Card/CardTitle'
import { CardContent } from '@/shared/ui/Card/CardContent'

export const AuthLayout = () => {
  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-gray-100">
      <Card className="w-full max-w-xl">
        <CardHeader>
          <CardTitle className="text-center">ВОЙТИ</CardTitle>
        </CardHeader>
        <CardContent>
          <Outlet />
        </CardContent>
      </Card>
    </div>
  )
}
