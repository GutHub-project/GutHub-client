import { useMutation, useQueryClient } from '@tanstack/react-query';
import { userApi } from '../apis';

/**
 * 회원 탈퇴 Hook
 *
 * @example
 * ```tsx
 * const { mutate: deleteAccount, isPending } = useDeleteAccount();
 *
 * const handleDelete = () => {
 *   if (confirm('정말 탈퇴하시겠습니까?')) {
 *     deleteAccount(undefined, {
 *       onSuccess: () => {
 *         // 로그아웃 처리 및 로그인 화면으로 이동
 *         console.log('회원 탈퇴 성공');
 *       },
 *       onError: (error) => {
 *         console.error('회원 탈퇴 실패:', error);
 *       },
 *     });
 *   }
 * };
 * ```
 */
export const useDeleteAccount = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => userApi.deleteAccount(),
    onSuccess: () => {
      // 모든 쿼리 캐시 초기화
      queryClient.clear();
    },
  });
};
