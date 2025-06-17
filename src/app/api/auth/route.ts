import { NextResponse } from 'next/server';
import { readFile, writeFile } from 'fs/promises';
import path from 'path';

export async function GET() {
    const userdata = await readFile(
        path.join(process.cwd(), 'src/data/userdata.json'),
        'utf-8'
    );
    return NextResponse.json(JSON.parse(userdata));
}

export async function PATCH(request: Request) {
    const { username, password } = await request.json();
    await writeFile(
        path.join(
            process.cwd(),
            'src/data/userdata.json'
        ),
        JSON.stringify({ username, password })
    );

    return NextResponse.json({ code: '0' });
}
