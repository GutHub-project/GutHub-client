# Dockerfile

# ----------------------------------------------------------------------
# Stage 1: Builder - 의존성 설치 준비 및 소스코드 복사, Pruning
# ----------------------------------------------------------------------
  FROM node:18-alpine AS builder
  LABEL stage=builder
  
  # Alpine Linux: C++ 빌드 도구 등 네이티브 모듈 빌드에 필요한 패키지 설치
  RUN apk add --no-cache libc6-compat openssl g++ make python3
  
  # pnpm 및 turbo 글로벌 설치
  RUN npm install -g pnpm turbo
  
  # 작업 디렉토리 설정
  WORKDIR /app
  
  # Turborepo prune 을 위한 기본 설정 파일 복사
  COPY package.json pnpm-lock.yaml pnpm-workspace.yaml* .npmrc* ./
  
  # 전체 소스코드 복사 (prune 명령 실행 위해 필요)
  COPY . .
  
  # turbo prune
  # --scope=web : 'apps/web' 앱과 그 의존성만 대상으로 함 (실제 앱 이름으로 변경!)
  # --docker    : Docker 빌드에 최적화된 pruned 출력 구조 생성 (json + full)
  RUN turbo prune --scope=web --docker
  
# ----------------------------------------------------------------------
# Stage 2: Installer - Pruned된 소스코드 기반 의존성 설치 및 빌드
# ----------------------------------------------------------------------
  FROM node:18-alpine AS installer
  LABEL stage=installer
  
  RUN apk add --no-cache libc6-compat openssl g++ make python3
  RUN npm install -g pnpm turbo
  WORKDIR /app
  
  # pnpm 설정: store 디렉토리 지정 (캐싱 최적화)
  RUN pnpm config set store-dir /root/.pnpm-store
  
  # Builder 스테이지의 'out' 디렉토리에서 prune된 결과물 복사
  # 1. 필요한 package.json 파일들 복사
  COPY --from=builder /app/out/json/ .
  # 2. Lock 파일 및 workspace 설정 파일 복사
  COPY --from=builder /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
  COPY --from=builder /app/out/pnpm-workspace.yaml ./pnpm-workspace.yaml*
  
  # 의존성 설치 (BuildKit 캐시 마운트 활용)
  # --mount=type=cache: Docker 빌드 간 캐시를 재사용하여 의존성 다운로드 시간 단축
  RUN --mount=type=cache,id=pnpm,target=/root/.pnpm-store \
      pnpm install --frozen-lockfile
  
  # Builder 스테이지의 'out' 디렉토리에서 prune된 전체 소스코드 복사
  COPY --from=builder /app/out/full/ .
  
  # (선택) 프로덕션용 환경 변수 파일 복사
  # COPY .env.production ./apps/web/.env.production
  
  # Turborepo 캐시를 활용한 빌드 (캐시 마운트)
  RUN --mount=type=cache,id=turbo,target=/app/.turbo \
      turbo run build --filter=web...
  
  # ----------------------------------------------------------------------
  # Stage 3: Runner - 빌드 결과물 및 최소 실행 환경 구성
  # ----------------------------------------------------------------------
  FROM node:18-alpine AS runner
  LABEL stage=runner
  WORKDIR /app
  
  # 사용자 및 그룹 생성
  RUN addgroup --system --gid 1001 nodejs
  RUN adduser --system --uid 1001 nextjs
  
  # 필요한 시스템 패키지만 설치 (예: openssl)
  RUN apk add --no-cache openssl libc6-compat
  
  # pnpm 설치 (실행 시 필요)
  RUN npm install -g pnpm
  
  # Installer 스테이지에서 프로덕션 의존성만 복사
  COPY --from=installer /app/node_modules ./node_modules
  # Installer 스테이지에서 빌드된 Next.js 앱 복사 (apps/web 디렉토리)
  COPY --from=installer /app/apps/web ./apps/web
  # 루트 package.json 복사
  COPY --from=installer /app/package.json ./package.json
  # pnpm workspace 설정 파일 복사
  COPY --from=installer /app/pnpm-workspace.yaml ./pnpm-workspace.yaml*
  
  # 작업 디렉토리를 실행할 앱 위치로 변경
  WORKDIR /app/apps/web
  
  # Next.js 기본 포트 3000 노출
  EXPOSE 3000
  
  # 환경 변수 설정 (Next.js 프로덕션 모드 필수)
  ENV NODE_ENV=production
  # Next.js Standalone Output 사용 시 필요할 수 있음
  # ENV PORT=3000
  
  # 디렉토리 소유권을 non-root 사용자로 변경
  # RUN chown -R nextjs:nodejs /app # 필요한 경우 주석 해제
  
  # non-root 사용자로 전환
  # USER nextjs
  
  # 컨테이너 시작 시 실행될 명령어
  # 옵션 1: pnpm workspace 명령 사용 (루트 package.json 및 pnpm-workspace.yaml 필요)
  # CMD ["pnpm", "--filter", "web", "start"]
  
  # 옵션 2: Next.js 직접 실행 (apps/web 디렉토리 내에서)
  # node_modules/.bin을 PATH에 추가하여 next 명령 실행
  CMD ["sh", "-c", "export PATH=$PATH:/app/node_modules/.bin && next start"]
  
  # (옵션) Docker Healthcheck 추가
  # HEALTHCHECK --interval=30s --timeout=5s --start-period=10s \
  #  CMD curl -f http://localhost:3000 || exit 1