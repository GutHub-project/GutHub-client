import { privateApiInstance } from '../instance';
import type { UserProfile } from '../../types';

/**
 * 프로필 수정 요청 타입
 */
export interface UpdateProfileRequest {
  name?: string;
  profileImage?: string;
  // TODO: 추가 필드가 필요하면 여기에 추가
}


/**
 * 사용자 관련 API 함수들
 */
export const userApi = {
  /**
   * 프로필 가져오기
   * @returns 사용자 프로필 정보
   */
  getProfile: async (): Promise<UserProfile> => {
    const response = await privateApiInstance.get<UserProfile>('/user/profile');
    return response.data;
  },

  /**
   * 프로필 수정
   * @param data - 수정할 프로필 정보
   * @returns 수정된 사용자 프로필 정보
   */
  updateProfile: async (data: UpdateProfileRequest): Promise<UserProfile> => {
    const response = await privateApiInstance.put<UserProfile>(
      '/user/profile',
      data
    );
    return response.data;
  },

  /**
   * 회원 탈퇴
   * @returns 성공 여부
   */
  deleteAccount: async (): Promise<void> => {
    await privateApiInstance.delete('/users');
  },
};
