import { useQuery } from '@tanstack/react-query';

import { userApi } from '../apis';

/**
 * 사용자 프로필 조회 Hook
 *
 * @example
 * ```tsx
 * const { data: profile, isLoading, error, refetch } = useUserProfile();
 *
 * if (isLoading) return <Loading />;
 * if (error) return <Error message={error.message} />;
 *
 * return <div>{profile?.name}</div>;
 * ```
 */
export const useUserProfile = () => {
  return useQuery({
    queryKey: ['user', 'profile'],
    queryFn: () => userApi.getProfile(),
    // 프로필은 자주 변경되지 않으므로 staleTime 설정
    staleTime: 5 * 60 * 1000, // 5분
    // 에러 발생 시 재시도 설정
    retry: 1,
  });
};
