import { NextRequest, NextResponse } from 'next/server'

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl

  // All /api/admin/* routes require a valid session cookie except the login endpoint itself
  if (pathname.startsWith('/api/admin') && pathname !== '/api/admin/login') {
    const session = req.cookies.get('admin_session')
    if (!session || session.value !== '1') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/api/admin/:path*'],
}
