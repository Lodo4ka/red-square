import { CardContent } from "@/shared/ui/Card/CardContent"
import { Card } from "@/shared/ui/Card/Card"
import { CardTitle } from "@/shared/ui/Card/CardTitle"
import { CardHeader } from "@/shared/ui/Card/CardHeader"
import { Outlet, useNavigate } from "react-router-dom"
import { useGetMeQuery } from "@/enteties/User/api/login"
import { PageLoader } from "@/shared/ui/page-loader"
import { ROUTES_PATH_CLIENT } from "@/shared/constants"
import { useEffect } from "react"

export const HomeLayout = () => {
  const { isLoading, isError, isFetching } = useGetMeQuery();
  const navigate = useNavigate();

  useEffect(() => {
    if (isError) {
      navigate(ROUTES_PATH_CLIENT.LOGIN);
    }
  }, [isError, navigate]);

  if (isLoading || isFetching) {
    return <PageLoader />;
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-gray-100">
      <Card className="w-full max-w-xl">
        <CardHeader>
          <CardTitle className="flex items-center">
            Список раундов
            <span className="ml-auto text-lg">Имя игрока</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Outlet />
        </CardContent>
      </Card>
    </div>
  )
}
