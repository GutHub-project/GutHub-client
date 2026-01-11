import { useQuery } from "@tanstack/react-query";
import { gutHealthApi } from "@repo/shared";

/**
 * 일별 장 건강 점수 조회 훅
 * @param date - 조회할 날짜 (YYYY-MM-DD 형식)
 */
export const useGutHealth = (date: string) => {
  const query = useQuery({
    queryKey: ['gutHealth', 'daily', date],
    queryFn: () => gutHealthApi.getDailyGutHealth(date),
    enabled: !!date,
  });
  return { ...query };
};

/**
 * 월별 장 건강 점수 조회 훅
 * @param month - 조회할 월 (YYYY-MM 형식)
 */
export const useMonthlyGutHealth = (month: string) => {
  const query = useQuery({
    queryKey: ['gutHealth', 'monthly', month],
    queryFn: () => gutHealthApi.getMonthlyGutHealth(month),
    enabled: !!month,
  });
  return { ...query };
};

export default useGutHealth;
