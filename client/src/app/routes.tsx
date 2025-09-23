import { Navigate, Route, Routes } from "react-router-dom";
import { AuthLayout } from "@/layouts/AuthLayout";
import { Login } from "@/pages/Login";
import { Home } from "@/pages/Home";
import { Round } from "@/pages/Round";
import { Game } from "@/pages/Game";
import { HomeLayout } from "@/layouts/HomeLayout";
import { GameLayout } from "@/layouts/GameLayout";
import { ROUTES_PATH_CLIENT } from "@/shared/constants";

const RoutesConfig = () => {
  return (
    <Routes>
      <Route element={<AuthLayout />}>
        <Route path={ROUTES_PATH_CLIENT.LOGIN} element={<Login />} />
      </Route>
      <Route path={ROUTES_PATH_CLIENT.HOME} element={<HomeLayout />}>
        <Route index element={<Home />} />
      </Route>
      <Route path={ROUTES_PATH_CLIENT.ROUND} element={<GameLayout />}>
        <Route path=":id" element={<Round />} />
      </Route>
      <Route path={ROUTES_PATH_CLIENT.GAME} element={<GameLayout />}>
        <Route path=":id" element={<Game />} />
      </Route>
      <Route path="*" element={<Navigate to={ROUTES_PATH_CLIENT.LOGIN} replace />} />
    </Routes>
  )
}

export default RoutesConfig
