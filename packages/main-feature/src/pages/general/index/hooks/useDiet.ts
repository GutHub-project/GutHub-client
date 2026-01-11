import { useQuery } from "@tanstack/react-query";
import { dietApi } from "@repo/shared";

/**
 * 날짜별 식단 조회 훅
 * @param date - 조회할 날짜 (YYYY-MM-DD 형식)
 */
const useDiet = (date: string) => {
  const query = useQuery({
    queryKey: ['diet', date],
    queryFn: () => dietApi.getDietsByDate(date),
    enabled: !!date,
  });
  return { ...query };
}

export default useDiet;
