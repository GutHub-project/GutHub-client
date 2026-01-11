import { useQuery } from "@tanstack/react-query";
import { dietApi } from "@repo/shared";

/**
 * 장 건강 연속 유지일 조회 훅
 */
const useStreak = () => {
  const query = useQuery({
    queryKey: ['diet', 'streak'],
    queryFn: () => dietApi.getStreak(),
  });
  return { ...query };
};

export default useStreak;
