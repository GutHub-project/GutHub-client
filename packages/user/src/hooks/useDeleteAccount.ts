import { useMutation, useQueryClient } from '@tanstack/react-query';
import CookieManager from '@react-native-cookies/cookies';
import { Platform } from 'react-native';
import { useAuthStore } from '@repo/shared';
import { userApi } from '../apis';

const isNative = Platform.OS !== 'web';

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
  const { logout: clearAuthState } = useAuthStore();

  return useMutation({
    mutationFn: () => userApi.deleteAccount(),
    onSuccess: async () => {
      // 모든 쿼리 캐시 초기화
      queryClient.clear();

      // 쿠키 삭제
      if (isNative) {
        await CookieManager.clearAll();
      }

      // 로컬 인증 데이터 초기화
      await clearAuthState();
    },
  });
};
