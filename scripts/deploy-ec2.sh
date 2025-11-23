#!/bin/bash

# EC2 배포 스크립트

set -e

AWS_REGION="${AWS_REGION:-ap-northeast-2}"
ECR_REPOSITORY="${ECR_REPOSITORY:-guthub-client}"
CONTAINER_NAME="${CONTAINER_NAME:-guthub-client}"
CONTAINER_PORT="${CONTAINER_PORT:-3000}"
HOST_PORT="${HOST_PORT:-3000}"
IMAGE_TAG="${IMAGE_TAG:-latest}"

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}GutHub Client Application 배포 시작${NC}"
echo -e "${GREEN}========================================${NC}"

# AWS ECR 로그인
echo -e "${YELLOW}1. AWS ECR 로그인 중...${NC}"
aws ecr get-login-password --region $AWS_REGION | docker login --username AWS --password-stdin $(aws ecr describe-repositories --repository-names $ECR_REPOSITORY --region $AWS_REGION --query 'repositories[0].repositoryUri' --output text | cut -d'/' -f1)

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ ECR 로그인 성공${NC}"
else
    echo -e "${RED}✗ ECR 로그인 실패${NC}"
    exit 1
fi

# ECR 레포지토리 URI 가져오기
ECR_REGISTRY=$(aws ecr describe-repositories --repository-names $ECR_REPOSITORY --region $AWS_REGION --query 'repositories[0].repositoryUri' --output text | cut -d'/' -f1)
FULL_IMAGE_NAME="$ECR_REGISTRY/$ECR_REPOSITORY:$IMAGE_TAG"

echo -e "${YELLOW}2. 기존 컨테이너 중지 및 제거...${NC}"
# 기존 컨테이너가 실행 중이라면 중지
if [ "$(docker ps -q -f name=$CONTAINER_NAME)" ]; then
    echo "컨테이너 '$CONTAINER_NAME' 중지 중..."
    docker stop $CONTAINER_NAME
    echo -e "${GREEN}✓ 컨테이너 중지 완료${NC}"
fi

# 기존 컨테이너가 존재한다면 제거
if [ "$(docker ps -aq -f name=$CONTAINER_NAME)" ]; then
    echo "컨테이너 '$CONTAINER_NAME' 제거 중..."
    docker rm $CONTAINER_NAME
    echo -e "${GREEN}✓ 컨테이너 제거 완료${NC}"
fi

# 새 이미지 pull
echo -e "${YELLOW}3. 새 Docker 이미지 다운로드 중...${NC}"
echo "이미지: $FULL_IMAGE_NAME"
docker pull $FULL_IMAGE_NAME

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ 이미지 다운로드 성공${NC}"
else
    echo -e "${RED}✗ 이미지 다운로드 실패${NC}"
    exit 1
fi

# 새 컨테이너 실행
echo -e "${YELLOW}4. 새 컨테이너 시작 중...${NC}"
docker run -d \
  --name $CONTAINER_NAME \
  -p $HOST_PORT:$CONTAINER_PORT \
  --restart unless-stopped \
  --log-driver json-file \
  --log-opt max-size=10m \
  --log-opt max-file=3 \
  $FULL_IMAGE_NAME

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ 컨테이너 시작 성공${NC}"
else
    echo -e "${RED}✗ 컨테이너 시작 실패${NC}"
    exit 1
fi

# 컨테이너 상태 확인
sleep 3
if [ "$(docker ps -q -f name=$CONTAINER_NAME)" ]; then
    echo -e "${GREEN}✓ 컨테이너가 정상적으로 실행 중입니다${NC}"
    docker ps -f name=$CONTAINER_NAME
else
    echo -e "${RED}✗ 컨테이너 실행에 실패했습니다${NC}"
    echo "컨테이너 로그:"
    docker logs $CONTAINER_NAME
    exit 1
fi

# 사용하지 않는 이미지 정리
echo -e "${YELLOW}5. 사용하지 않는 Docker 이미지 정리 중...${NC}"
docker image prune -af --filter "until=24h"
echo -e "${GREEN}✓ 이미지 정리 완료${NC}"

# 디스크 사용량 확인
echo -e "${YELLOW}6. 디스크 사용량 확인...${NC}"
df -h /

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}배포 완료!${NC}"
echo -e "${GREEN}애플리케이션 URL: http://localhost:$HOST_PORT${NC}"
echo -e "${GREEN}========================================${NC}"

# 컨테이너 로그 확인 (마지막 10줄)
echo -e "${YELLOW}최근 로그:${NC}"
docker logs --tail 10 $CONTAINER_NAME

