import { Card } from "@/shared/ui/Card/Card"
import { CardHeader } from "@/shared/ui/Card/CardHeader"
import { CardTitle } from "@/shared/ui/Card/CardTitle"
import { CardContent } from "@/shared/ui/Card/CardContent"
import { Outlet, useNavigate, useParams } from "react-router-dom"
import { PageLoader } from "@/shared/ui/page-loader"
import { useGetMeQuery } from "@/enteties/User/api/login"
import { ROUTES_PATH_CLIENT } from "@/shared/constants";
import { useEffect } from "react"
import { useSelector } from "react-redux"
import { type UserStore } from "@/enteties/User/model"

export const GameLayout = () => {
  const { isLoading, isError, isFetching } = useGetMeQuery();
  const user = useSelector((state: { user: { user: UserStore } }) => {
    return state.user?.user;
  });
  const navigate = useNavigate();
  const { id } = useParams();

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
            Раунд {id}
            <span className="ml-auto text-lg">{user?.name}</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Outlet />
        </CardContent>
      </Card>
    </div>
  )
}
