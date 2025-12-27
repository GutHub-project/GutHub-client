import { useMutation, useQueryClient } from '@tanstack/react-query';

import { userApi, UpdateProfileRequest } from '../apis';

/**
 * 프로필 수정 Hook
 *
 * @example
 * ```tsx
 * const { mutate: updateProfile, isPending, error } = useUpdateProfile();
 *
 * const handleUpdate = () => {
 *   updateProfile(
 *     { name: '새 이름', profileImage: 'https://...' },
 *     {
 *       onSuccess: (data) => {
 *         console.log('프로필 수정 성공:', data);
 *       },
 *       onError: (error) => {
 *         console.error('프로필 수정 실패:', error);
 *       },
 *     }
 *   );
 * };
 * ```
 */
export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateProfileRequest) => userApi.updateProfile(data),
    onSuccess: (data) => {
      // 프로필 쿼리 캐시를 새 데이터로 업데이트
      queryClient.setQueryData(['user', 'profile'], data);
    },
  });
};
