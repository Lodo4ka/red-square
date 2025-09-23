import { Navigate, Outlet } from 'react-router-dom'
import { Card } from '@/shared/ui/Card/Card'
import { CardHeader } from '@/shared/ui/Card/CardHeader'
import { CardTitle } from '@/shared/ui/Card/CardTitle'
import { CardContent } from '@/shared/ui/Card/CardContent'
import { useGetMeQuery } from '@/enteties/User/api/login'
import { PageLoader } from '@/shared/ui/page-loader'
import { ROUTES_PATH_CLIENT } from '@/shared/constants'

export const AuthLayout = () => {
  const { isLoading, isError } = useGetMeQuery();

  if (isLoading) {
    return <PageLoader />;
  }

  if (!isLoading && !isError) return <Navigate to={ROUTES_PATH_CLIENT.HOME} replace />;

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
