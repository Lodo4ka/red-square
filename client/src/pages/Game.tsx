import { useGetRoundQuery } from "@/enteties/Game/api/game";
import { GameCard } from "@/enteties/Game/ui/GameCard"
import { useParams } from "react-router-dom";

export const Game = () => {
  const { id } = useParams();
  const { data: round } = useGetRoundQuery(id as string);

  if (!round) {
    return <div>Round not found</div>;
  }

  return <GameCard round={round} />
}
