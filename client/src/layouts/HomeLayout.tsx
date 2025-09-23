import { CardContent } from "@/shared/ui/Card/CardContent"
import { Card } from "@/shared/ui/Card/Card"
import { CardTitle } from "@/shared/ui/Card/CardTitle"
import { CardHeader } from "@/shared/ui/Card/CardHeader"
import { Outlet } from "react-router-dom"

export const HomeLayout = () => {
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
