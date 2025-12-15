import { useQuery } from "@tanstack/react-query";
import { dietApi } from "src/apis/dietInfo";

const useDiet = (date: string) => {
  const query = useQuery({
    queryKey: ['diet'],
    queryFn: () => dietApi.getDiet(date),
  });
  return { ...query };
}

export default useDiet;