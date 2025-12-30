import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://api.guthub.shop:8080';

/**
 * API 프록시 라우트
 * HTTPS 사이트에서 HTTP API 호출 시 Mixed Content 문제 해결
 *
 * 예시:
 * 브라우저 → https://guthub.shop/api/auth/signup/complete (HTTPS)
 * Next.js → http://api.guthub.shop:8080/auth/signup/complete (HTTP)
 */

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  const params = await context.params;
  return proxyRequest(request, params.path, 'GET');
}

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  const params = await context.params;
  return proxyRequest(request, params.path, 'POST');
}

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  const params = await context.params;
  return proxyRequest(request, params.path, 'PUT');
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  const params = await context.params;
  return proxyRequest(request, params.path, 'DELETE');
}

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  const params = await context.params;
  return proxyRequest(request, params.path, 'PATCH');
}

async function proxyRequest(
  request: NextRequest,
  pathSegments: string[],
  method: string
) {
  try {
    const path = pathSegments.join('/');
    const searchParams = request.nextUrl.searchParams.toString();
    const targetUrl = `${API_BASE_URL}/${path}${searchParams ? `?${searchParams}` : ''}`;

    console.log(`[API Proxy] ${method} ${targetUrl}`);

    // 요청 헤더 복사 (Host 제외)
    const headers: HeadersInit = {};
    request.headers.forEach((value: string, key: string) => {
      if (key.toLowerCase() !== 'host' && key.toLowerCase() !== 'connection') {
        headers[key] = value;
      }
    });

    console.log('[API Proxy] Headers:', {
      authorization: headers['authorization'] || headers['Authorization'],
      contentType: headers['content-type'],
    });

    // 요청 바디 복사
    let body: any = undefined;
    if (method !== 'GET' && method !== 'DELETE') {
      const contentType = request.headers.get('content-type');
      if (contentType?.includes('application/json')) {
        body = await request.json();
        console.log('[API Proxy] Request body:', body);
      } else if (contentType?.includes('multipart/form-data')) {
        body = await request.formData();
      } else {
        body = await request.text();
      }
    }

    // 백엔드 API 호출
    const response = await fetch(targetUrl, {
      method,
      headers,
      body: body ? (body instanceof FormData ? body : JSON.stringify(body)) : undefined,
      credentials: 'include', // 쿠키 전달
    });

    // 응답 헤더 복사
    const responseHeaders = new Headers();
    response.headers.forEach((value: string, key: string) => {
      // CORS 관련 헤더는 제외 (Next.js가 자동 처리)
      if (!key.toLowerCase().startsWith('access-control-')) {
        responseHeaders.set(key, value);
      }
    });

    // 응답 바디 복사
    const responseContentType = response.headers.get('content-type');
    let responseBody: any;

    if (responseContentType?.includes('application/json')) {
      responseBody = await response.json();
      console.log('[API Proxy] Response status:', response.status);
      console.log('[API Proxy] Response body:', responseBody);
      return NextResponse.json(responseBody, {
        status: response.status,
        headers: responseHeaders,
      });
    } else {
      responseBody = await response.text();
      console.log('[API Proxy] Response status:', response.status);
      console.log('[API Proxy] Response body:', responseBody);
      return new NextResponse(responseBody, {
        status: response.status,
        headers: responseHeaders,
      });
    }
  } catch (error) {
    console.error('[API Proxy] Error:', error);
    return NextResponse.json(
      {
        code: 'PROXY_ERROR',
        message: '프록시 서버 오류가 발생했습니다.',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
