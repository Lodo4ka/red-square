import { useGetRoundQuery } from "@/enteties/Game/api/game";
import { RoundStats } from "@/enteties/Round/ui/RounStats";
import { useParams } from "react-router-dom";

export const Round = () => {
  const { id } = useParams();
  const { data: round } = useGetRoundQuery(id as string);

  if (!round) {
    return <div>Round not found</div>;
  }

  return (
    <div>
      <RoundStats round={round} />
    </div>
  )
}
