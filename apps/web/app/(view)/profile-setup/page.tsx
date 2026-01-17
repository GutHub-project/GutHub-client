'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect, Suspense } from 'react';
import { authApi, useAuthStore, type Gender } from '@repo/shared';

/**
 * 프로필 설정 페이지 (신규 회원)
 * OAuth 인증 후 백엔드에서 이 페이지로 리다이렉트
 */
function ProfileSetupContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setAccessToken, setUser } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [tempToken, setTempToken] = useState<string | null>(null);
  const [formData, setFormData] = useState<{
    nickname: string;
    ageRange: number;
    gender: Gender | '';
    gutType: string;
  }>({
    nickname: '',
    ageRange: 0,
    gender: '',
    gutType: '',
  });

  useEffect(() => {
    const token = searchParams.get('tempToken');
    if (!token) {
      alert('인증 정보가 없습니다.');
      router.replace('/login');
      return;
    }
    setTempToken(token);
  }, [searchParams, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!tempToken) {
      alert('인증 정보가 없습니다.');
      return;
    }

    if (!formData.nickname.trim()) {
      alert('닉네임을 입력해주세요.');
      return;
    }

    try {
      setIsLoading(true);
      console.log('[ProfileSetup] Submitting with tempToken:', tempToken);
      console.log('[ProfileSetup] Form data:', formData);

      // 회원가입 완료 API 호출 (공통 authApi 사용)
      const data = await authApi.completeSignup({
        nickname: formData.nickname,
        ageRange: formData.ageRange,
        gender: formData.gender as Gender,
        gutType: formData.gutType,
      }, tempToken);

      // 액세스 토큰 저장 및 상태 업데이트
      await setAccessToken(data.accessToken);
      
      // 유저 정보도 store에 저장 (프로필 설정한 정보)
      setUser({
        nickname: formData.nickname,
        ageRange: formData.ageRange,
        gender: formData.gender as Gender,
        gutType: {
          code: formData.gutType,
          name: formData.gutType,
          description: '',
          imageUrl: '',
        },
      });
      
      router.replace('/');
    } catch (error) {
      console.error('프로필 설정 중 오류:', error);
      alert('프로필 설정에 실패했습니다.');
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
  const genderOptions: { label: string; value: Gender }[] = [
    { label: '남성', value: 'MALE' },
    { label: '여성', value: 'FEMALE' },
  ];
  const gutTypeOptions = [
    { label: '건강형', value: '건강형' },
    { label: '변비형', value: '변비형' },
    { label: '설사형', value: '설사형' },
    { label: '가스·복부팽만형', value: '가스·복부팽만형' },
  ];

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#fff',
      padding: '0',
      position: 'relative',
      paddingTop: 'env(safe-area-inset-top)',
    }}>
      {/* 헤더 */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '16px 20px',
        borderBottom: '1px solid #f0f0f0',
      }}>
        <button
          onClick={() => router.back()}
          style={{
            fontSize: '20px',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '8px',
          }}
        >
          ←
        </button>
        <h1 style={{
          fontSize: '16px',
          fontWeight: '600',
          margin: 0,
          color: '#000',
        }}>
          프로필 설정
        </h1>
        <button
          style={{
            width: '24px',
            height: '24px',
            borderRadius: '50%',
            border: '1px solid #ff6b6b',
            background: 'none',
            color: '#ff6b6b',
            fontSize: '12px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          ⓘ
        </button>
      </div>

      <form onSubmit={handleSubmit} style={{ padding: '20px' }}>
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
                onClick={() => setFormData(prev => ({ ...prev, gutType: option.value }))}
                style={{
                  padding: '12px 20px',
                  borderRadius: '20px',
                  border: formData.gutType === option.value ? '2px solid #ff6b6b' : '1px solid #e0e0e0',
                  backgroundColor: '#fff',
                  color: formData.gutType === option.value ? '#ff6b6b' : '#999',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: formData.gutType === option.value ? '600' : '400',
                }}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* 완료 버튼 */}
        <button
          type="submit"
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
            cursor: formData.nickname.trim() ? 'pointer' : 'not-allowed',
          }}
        >
          {isLoading ? '처리 중...' : '완료'}
        </button>
      </form>
    </div>
  );
}

export default function ProfileSetupPage() {
  return (
    <Suspense fallback={
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontSize: '16px',
        color: '#666'
      }}>
        로딩 중...
      </div>
    }>
      <ProfileSetupContent />
    </Suspense>
  );
}