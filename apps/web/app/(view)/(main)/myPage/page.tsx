'use client';

import { useState, Suspense } from 'react';
import { userApi, authApi, useAuthStore } from '@repo/shared';
import { useSearchParams } from 'next/navigation';

/**
 * 마이페이지 - 프로필 조회 및 수정
 *
 * 로그인 상태에 따라 다르게 동작:
 * - 로그인 O: 프로필 조회 및 수정 (userApi)
 * - 로그인 X (회원가입): 프로필 등록 (authApi.completeSignup)
 */
function MyPageContent() {
  const { isAuthenticated } = useAuthStore();
  const searchParams = useSearchParams();
  const tempToken = searchParams.get('tempToken'); // 회원가입 시 임시 토큰

  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<{
    nickname: string;
    ageRange: number;
    gender: string;
    gutTypeCode: string; // 선택된 장 건강 유형 코드
  }>({
    nickname: '',
    ageRange: 0,
    gender: '',
    gutTypeCode: '',
  });

  // 회원가입 모드인지 확인 (로그인 안됐고 tempToken 있으면 회원가입)
  const isSignupMode = !isAuthenticated && !!tempToken;

  // 프로필 가져오기 (로그인된 사용자만)
  const handleGetProfile = async () => {
    try {
      setIsLoading(true);
      const profile = await userApi.getProfile();
      console.log('[MyPage] 프로필 조회:', profile);

      setFormData({
        nickname: profile.nickname || '',
        ageRange: profile.ageRange || 0,
        gender: profile.gender || '',
        gutTypeCode: profile.gutType?.code || '',
      });

      alert('프로필을 불러왔습니다.');
    } catch (error) {
      console.error('[MyPage] 프로필 조회 실패:', error);
      alert('프로필 조회에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  // 프로필 업데이트 (로그인된 사용자)
  const handleUpdateProfile = async () => {
    if (!formData.nickname.trim()) {
      alert('닉네임을 입력해주세요.');
      return;
    }

    try {
      setIsLoading(true);
      const updatedProfile = await userApi.updateProfile({
        name: formData.nickname,
        // TODO: 백엔드 API가 ageRange, gender, gutType을 지원하면 추가
      });
      console.log('[MyPage] 프로필 업데이트:', updatedProfile);

      alert('프로필이 업데이트되었습니다.');
    } catch (error) {
      console.error('[MyPage] 프로필 업데이트 실패:', error);
      alert('프로필 업데이트에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  // 회원가입 완료 (신규 사용자)
  const handleCompleteSignup = async () => {
    if (!formData.nickname.trim()) {
      alert('닉네임을 입력해주세요.');
      return;
    }

    if (!tempToken) {
      alert('인증 정보가 없습니다.');
      return;
    }

    try {
      setIsLoading(true);
      const signupData = {
        nickname: formData.nickname,
        ageRange: formData.ageRange,
        gender: formData.gender,
        gutType: formData.gutTypeCode,
      };

      const response = await authApi.completeSignup(signupData, tempToken);
      console.log('[MyPage] 회원가입 완료:', response);

      alert('회원가입이 완료되었습니다!');
      // TODO: 홈으로 이동 또는 로그인 처리
    } catch (error) {
      console.error('[MyPage] 회원가입 실패:', error);
      alert('회원가입에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const ageOptions = [
    { label: '10대', value: 10 },
    { label: '20대', value: 20 },
    { label: '30대', value: 30 },
    { label: '40대', value: 40 },
  ];
  const genderOptions = [
    { label: '남성', value: 'MALE' },
    { label: '여성', value: 'FEMALE' },
  ];
  const gutTypeOptions = [
    { label: '가스 예민형', value: 'GUT-001' },
    { label: '변비형', value: 'GUT-002' },
    { label: '설사형', value: 'GUT-003' },
    { label: '건강형', value: 'GUT-004' },
  ];

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#fff',
      padding: '0',
      position: 'relative',
    }}>
      {/* 헤더 */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px 20px',
        paddingTop: 'calc(16px + env(safe-area-inset-top))',
        borderBottom: '1px solid #f0f0f0',
      }}>
        <h1 style={{
          fontSize: '16px',
          fontWeight: '600',
          margin: 0,
          color: '#000',
        }}>
          마이페이지
        </h1>
      </div>

      <div style={{ padding: '20px' }}>
        {/* 프로필 사진 */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{
            width: '100px',
            height: '100px',
            borderRadius: '50%',
            backgroundColor: '#f0f0f0',
            margin: '0 auto',
            position: 'relative',
          }}>
            <div style={{
              position: 'absolute',
              right: 0,
              bottom: 0,
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              backgroundColor: '#ff8a8a',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '2px solid #fff',
              fontSize: '14px',
            }}>
              📷
            </div>
          </div>
        </div>

        {/* 닉네임 */}
        <div style={{ marginBottom: '32px' }}>
          <label htmlFor="nickname" style={{
            display: 'block',
            fontWeight: '600',
            marginBottom: '12px',
            fontSize: '14px',
            color: '#000',
          }}>
            닉네임
          </label>
          <div style={{
            borderBottom: '1px solid #e0e0e0',
            paddingBottom: '12px',
            display: 'flex',
            alignItems: 'center',
          }}>
            <input
              id="nickname"
              type="text"
              placeholder="김허브 |"
              value={formData.nickname}
              onChange={(e) => setFormData(prev => ({ ...prev, nickname: e.target.value }))}
              style={{
                width: '100%',
                border: 'none',
                outline: 'none',
                fontSize: '16px',
                padding: 0,
                color: '#000',
              }}
            />
            {formData.nickname && (
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, nickname: '' }))}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#ccc',
                  fontSize: '18px',
                  cursor: 'pointer',
                  padding: '0 8px',
                }}
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* 연령대 */}
        <div style={{ marginBottom: '32px' }}>
          <div style={{
            display: 'block',
            fontWeight: '600',
            marginBottom: '12px',
            fontSize: '14px',
            color: '#000',
          }}>
            연령대
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            {ageOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, ageRange: option.value }))}
                style={{
                  flex: 1,
                  padding: '12px 0',
                  borderRadius: '8px',
                  border: formData.ageRange === option.value ? '2px solid #ff6b6b' : '1px solid #e0e0e0',
                  backgroundColor: formData.ageRange === option.value ? '#fff' : '#f8f8f8',
                  color: formData.ageRange === option.value ? '#ff6b6b' : '#999',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: formData.ageRange === option.value ? '600' : '400',
                }}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* 성별 */}
        <div style={{ marginBottom: '32px' }}>
          <div style={{
            display: 'block',
            fontWeight: '600',
            marginBottom: '12px',
            fontSize: '14px',
            color: '#000',
          }}>
            성별
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            {genderOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, gender: option.value }))}
                style={{
                  flex: 1,
                  padding: '14px 0',
                  borderRadius: '8px',
                  border: formData.gender === option.value ? '2px solid #ff6b6b' : '1px solid #e0e0e0',
                  backgroundColor: '#fff',
                  color: formData.gender === option.value ? '#ff6b6b' : '#999',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: formData.gender === option.value ? '600' : '400',
                }}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* 장건강 유형 */}
        <div style={{ marginBottom: '40px' }}>
          <div style={{
            display: 'block',
            fontWeight: '600',
            marginBottom: '12px',
            fontSize: '14px',
            color: '#000',
          }}>
            장건강 유형
          </div>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {gutTypeOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, gutTypeCode: option.value }))}
                style={{
                  padding: '12px 20px',
                  borderRadius: '20px',
                  border: formData.gutTypeCode === option.value ? '2px solid #ff6b6b' : '1px solid #e0e0e0',
                  backgroundColor: '#fff',
                  color: formData.gutTypeCode === option.value ? '#ff6b6b' : '#999',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: formData.gutTypeCode === option.value ? '600' : '400',
                }}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* 완료 버튼 */}
        <button
          type="button"
          onClick={isSignupMode ? handleCompleteSignup : handleUpdateProfile}
          disabled={!formData.nickname.trim() || isLoading}
          style={{
            width: '100%',
            padding: '16px',
            borderRadius: '8px',
            border: 'none',
            backgroundColor: formData.nickname.trim() ? '#ff6b6b' : '#e0e0e0',
            color: '#fff',
            fontSize: '16px',
            fontWeight: '600',
            cursor: formData.nickname.trim() && !isLoading ? 'pointer' : 'not-allowed',
          }}
        >
          {isLoading ? '처리 중...' : isSignupMode ? '회원가입 완료' : '프로필 업데이트'}
        </button>
      </div>
    </div>
  );
}

export default function MyPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <MyPageContent />
    </Suspense>
  );
}
