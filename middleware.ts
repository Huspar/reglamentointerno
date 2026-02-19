import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
    // Only protect /admin routes
    if (req.nextUrl.pathname.startsWith('/admin')) {
        const authHeader = req.headers.get('authorization');

        if (authHeader) {
            // Extract credentials from header
            const authValue = authHeader.split(' ')[1];
            const [user, pwd] = atob(authValue).split(':');

            const validUser = process.env.ADMIN_USER || 'admin';
            const validPwd = process.env.ADMIN_PASSWORD || 'admin123';

            if (user === validUser && pwd === validPwd) {
                return NextResponse.next();
            }
        }

        // If no auth or invalid auth, return 401
        return new NextResponse('Authentication required', {
            status: 401,
            headers: {
                'WWW-Authenticate': 'Basic realm="Admin Area"',
            },
        });
    }

    return NextResponse.next();
}

export const config = {
    matcher: '/admin/:path*',
};
