import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// 需要登录才能访问的路由
const protectedRoutes = ['/home', '/categories', '/knowledge', '/ai', '/3d', '/profile']

// 公开路由
const publicRoutes = ['/', '/login', '/register']

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // 检查是否是受保护的路由
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route))
  const isPublicRoute = publicRoutes.includes(pathname)

  // 暂时只做简单的路由检查，不做认证验证
  // 认证验证应该在客户端组件中进行

  return NextResponse.next()
}

// 配置 middleware 匹配的路径
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|images|videos|models|api).*)',
  ],
}
