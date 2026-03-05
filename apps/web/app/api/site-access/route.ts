import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    try {
        const { password } = await req.json();

        if (password === process.env.SITE_PASSWORD) {
            const response = NextResponse.json({ success: true });

            // Set a cookie that expires in 30 days
            response.cookies.set('site-access-token', 'granted', {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                maxAge: 60 * 60 * 24 * 30,
                path: '/',
            });

            return response;
        }

        return NextResponse.json({ success: false, message: 'Invalid password' }, { status: 401 });
    } catch (error) {
        return NextResponse.json({ success: false, message: 'Internal error' }, { status: 500 });
    }
}
