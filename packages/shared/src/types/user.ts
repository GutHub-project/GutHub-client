import type { Gender } from './api';
import type { GutType } from './auth';

// ==================== 사용자 API 타입 ====================

/**
 * 아이디 중복 확인 요청
 */
export interface CheckUsernameRequest {
  username: string;
}

/**
 * 아이디 중복 확인 응답
 */
export interface CheckUsernameResponse {
  isAvailable: boolean;
}

/**
 * 회원가입 요청
 */
export interface SignupRequest {
  username: string;
  password: string;
  nickname: string;
  email?: string;
}

/**
 * 회원가입 응답
 */
export interface SignupResponse {
  userEntityId: number;
}

/**
 * 내 정보 조회 응답
 */
export interface UserInfoResponse {
  username: string;
  social: boolean;
  nickname: string;
  email: string | null;
}

/**
 * 내 정보 수정 요청
 */
export interface UpdateUserInfoRequest {
  username: string;
  nickname: string;
  email?: string;
}

/**
 * 내 정보 수정 응답
 */
export interface UpdateUserInfoResponse {
  userEntityId: number;
}

/**
 * 회원 탈퇴 요청
 */
export interface DeleteUserRequest {
  username: string;
}

// ==================== 프로필 API 타입 ====================

/**
 * 프로필 정보 조회 응답
 */
export interface ProfileResponse {
  nickname: string;
  ageRange: number;
  gender: Gender;
  gutType: GutType;
}

/**
 * 프로필 정보 수정 요청
 */
export interface UpdateProfileRequest {
  nickname: string;
  ageRange: number;
  gender: Gender;
  gutType: string;
}

/**
 * 프로필 정보 수정 응답
 */
export interface UpdateProfileResponse {
  userEntityId: number;
}

/**
 * 소셜 회원가입 완료 요청
 */
export interface CompleteSignupRequest {
  nickname: string;
  ageRange: number;
  gender: Gender;
  gutType: string;
}

/**
 * 소셜 회원가입 완료 응답
 */
export interface CompleteSignupResponse {
  accessToken: string;
}
