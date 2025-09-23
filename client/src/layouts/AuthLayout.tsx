import { Outlet, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { Card } from '@/shared/ui/Card/Card'
import { CardHeader } from '@/shared/ui/Card/CardHeader'
import { CardTitle } from '@/shared/ui/Card/CardTitle'
import { CardContent } from '@/shared/ui/Card/CardContent'
import { useGetMeQuery } from '@/enteties/User/api/login'
import { PageLoader } from '@/shared/ui/page-loader'
import { ROUTES_PATH_CLIENT } from '@/shared/constants'

export const AuthLayout = () => {
  const { isLoading, isFetching, isSuccess } = useGetMeQuery();
  const navigate = useNavigate();

  useEffect(() => {
    if (isSuccess) {
      navigate(ROUTES_PATH_CLIENT.HOME);
    }
  }, [isSuccess, navigate]);

  if (isLoading || isFetching) {
    return <PageLoader />;
  }

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
