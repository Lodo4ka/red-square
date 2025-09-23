import { useCreateRoundMutation, useGetRoundsQuery } from "@/enteties/Round/api";
import { RoundCard } from "@/enteties/Round/ui/RoundCard";
import { PageLoader } from "@/shared/ui/page-loader";
import { useSelector } from "react-redux";
import { type UserStore } from "@/enteties/User/model";
import { Button } from "@/shared/ui/button";
import { ROUTES_PATH_CLIENT } from "@/shared/constants";
import { useNavigate } from "react-router-dom";
import { type Status } from "@/enteties/Round/type";

export const Home = () => {
  const { data: rounds, isLoading: isLoadingRounds } = useGetRoundsQuery();
  const [createRound, { isLoading: isCreatingRound }] = useCreateRoundMutation();
  const navigate = useNavigate();
  const isAdmin = useSelector((state: { user: { user: UserStore } }) => {
    return state.user?.user?.isAdmin;
  });

  const user = useSelector((state: { user: { user: UserStore } }) => {
    return state.user?.user;
  });
  if (isLoadingRounds || isCreatingRound) {
    return <PageLoader />;
  }

  const handleCreateRound = async () => {
    const roundId = await createRound({ adminId: user.id }).unwrap();
    navigate(`${ROUTES_PATH_CLIENT.GAME}/${roundId}`);
  }

  const handleRoundClick = (roundId: number, status: Status) => {
    if (status === 'active' || status === 'cooldown') {
      navigate(`${ROUTES_PATH_CLIENT.GAME}/${roundId}`);
    } else {
      navigate(`${ROUTES_PATH_CLIENT.ROUND}/${roundId}`);
    }
  }

  return (
    <div>
      {isAdmin && <div className="flex">
        <Button className="mb-4" onClick={handleCreateRound} variant='outline'>
          Создать новый раунд
        </Button>
      </div>}
      {rounds?.map((round) => (
        <RoundCard className="cursor-pointer mb-4" key={round.id} id={round.id} startAt={round.startTime} endAt={round.endTime} status={round.status} onClick={() => handleRoundClick(round.id, round.status)} />
      ))}
    </div>
  )
}
