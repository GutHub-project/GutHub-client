import { publicApiInstance, privateApiInstance } from '../instance';
import type {
  ApiResponse,
  CheckUsernameRequest,
  CheckUsernameResponse,
  SignupRequest,
  SignupResponse,
  UserInfoResponse,
  UpdateUserInfoRequest,
  UpdateUserInfoResponse,
  DeleteUserRequest,
  ProfileResponse,
  UpdateProfileRequest,
  UpdateProfileResponse,
  CompleteSignupRequest,
  CompleteSignupResponse,
} from '../../types';

/**
 * 사용자 관련 API 함수들
 */
export const userApi = {
  // ==================== 사용자 API ====================

  /**
   * 아이디 중복 확인
   * @param data - 확인할 아이디 정보
   * @returns 사용 가능 여부
   */
  checkUsername: async (data: CheckUsernameRequest): Promise<CheckUsernameResponse> => {
    const response = await publicApiInstance.post<ApiResponse<CheckUsernameResponse>>(
      '/user/exist',
      data
    );
    return response.data.data;
  },

  /**
   * 회원가입
   * @param data - 회원가입 정보
   * @returns 생성된 사용자 ID
   */
  signup: async (data: SignupRequest): Promise<SignupResponse> => {
    const response = await publicApiInstance.post<ApiResponse<SignupResponse>>(
      '/user',
      data
    );
    return response.data.data;
  },

  /**
   * 내 정보 조회
   * @returns 사용자 정보
   */
  getMyInfo: async (): Promise<UserInfoResponse> => {
    const response = await privateApiInstance.get<ApiResponse<UserInfoResponse>>('/user');
    return response.data.data;
  },

  /**
   * 내 정보 수정
   * @param data - 수정할 정보
   * @returns 수정된 사용자 ID
   */
  updateMyInfo: async (data: UpdateUserInfoRequest): Promise<UpdateUserInfoResponse> => {
    const response = await privateApiInstance.put<ApiResponse<UpdateUserInfoResponse>>(
      '/user',
      data
    );
    return response.data.data;
  },

  /**
   * 회원 탈퇴
   * @param data - 탈퇴할 사용자 정보
   */
  deleteAccount: async (data: DeleteUserRequest): Promise<void> => {
    await privateApiInstance.delete('/user', { data });
  },

  // ==================== 프로필 API ====================

  /**
   * 프로필 정보 조회
   * @returns 프로필 정보
   */
  getProfile: async (): Promise<ProfileResponse> => {
    const response = await privateApiInstance.get<ApiResponse<ProfileResponse>>('/user/profile');
    return response.data.data;
  },

  /**
   * 프로필 정보 수정
   * @param data - 수정할 프로필 정보
   * @returns 수정된 사용자 ID
   */
  updateProfile: async (data: UpdateProfileRequest): Promise<UpdateProfileResponse> => {
    const response = await privateApiInstance.put<ApiResponse<UpdateProfileResponse>>(
      '/user/profile',
      data
    );
    return response.data.data;
  },
};

/**
 * 프로필 API (별칭)
 */
export const profileApi = {
  /**
   * 프로필 정보 조회
   */
  getProfile: userApi.getProfile,

  /**
   * 프로필 정보 수정
   */
  updateProfile: userApi.updateProfile,
};
