# 모바일 흰 화면 디버깅 단계

## 1. 로컬에서 먼저 테스트 (빌드 기다리는 동안)

```bash
cd apps/native

# 캐시 클리어
rm -rf .expo
rm -rf node_modules/.cache

# 개발 서버 시작 (캐시 클리어)
npx expo start --clear

# Expo Go 앱에서 테스트
# - QR 코드 스캔
# - Alert 확인 (3초 후 나타남)
```

## 2. Alert 메시지 확인

Alert에서 다음 값들을 확인:
- `loaded`: true/false (폰트 로딩 완료 여부)
- `error`: null/Error (폰트 로딩 에러)
- `fontsReady`: true/false (loaded || error)
- `isReady`: true/false (인증 초기화 완료)

## 3. 예상되는 문제들

### Case 1: loaded=false, error=null, isReady=true
**원인**: 폰트가 계속 로딩 중
**해결**: 
- 폰트 파일 경로 확인
- expo-font 플러그인 확인
- 앱 재시작

### Case 2: loaded=false, error=Error, isReady=true
**원인**: 폰트 로딩 실패했지만 fontsReady=true가 되어야 함
**해결**: 이미 수정됨 (loaded || error)

### Case 3: loaded=true, error=null, isReady=false
**원인**: 인증 초기화가 안됨
**해결**: 
- initializeAuth() 함수 확인
- EncryptedStorage 권한 확인

### Case 4: loaded=false, error=null, isReady=false
**원인**: 둘 다 안됨
**해결**:
- 앱이 아예 실행 안되는 것
- 크래시 로그 확인

## 4. EAS 빌드 로그 확인

빌드 완료 후:
https://expo.dev/accounts/jinnicoco/projects/Guthub/builds/aaef9da4-a352-46e9-8155-6f4dadf0fdf2

확인할 것:
- 빌드 에러 없는지
- 폰트 파일이 번들에 포함되었는지
- 플러그인이 제대로 적용되었는지
