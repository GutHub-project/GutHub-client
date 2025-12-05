/**
 * ============================================================
 * 회원가입 관련 타입 정의
 * ============================================================
 */

import { AgeGroup } from './profile';

/**
 * 회원가입 1단계 데이터 (아이디, 비밀번호)
 */
export interface SignupStep1Data {
  userId: string;
  password: string;
  passwordConfirm: string;
}

/**
 * 회원가입 2단계 데이터 (닉네임, 이메일, 연령대)
 */
export interface SignupStep2Data {
  nickname: string;
  email: string;
  ageGroup: AgeGroup;
}

/**
 * 회원가입 전체 데이터
 */
export interface SignupData extends SignupStep1Data, SignupStep2Data {}

/**
 * 회원가입 요청 DTO
 * TODO: 백엔드 API 스펙에 맞게 수정
 */
export interface SignupRequest {
  userId: string;
  password: string;
  nickname: string;
  email: string;
  ageGroup: string;
}

/**
 * 회원가입 응답 DTO
 * TODO: 백엔드 API 스펙에 맞게 수정
 */
export interface SignupResponse {
  success: boolean;
  message: string;
  user?: {
    id: string;
    userId: string;
    nickname: string;
    email: string;
  };
}

