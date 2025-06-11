export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';

export async function GET() {
    return NextResponse.json({
        code: '0',
        version: process.env.NEXT_PUBLIC_APP_VERSION
    });
}
