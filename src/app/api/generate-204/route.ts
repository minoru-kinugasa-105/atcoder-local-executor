import { NextResponse } from 'next/server';

export async function HEAD() {
    return new NextResponse(null, { status: 204 });
}
