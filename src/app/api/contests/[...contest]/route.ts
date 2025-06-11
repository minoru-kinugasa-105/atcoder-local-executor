import { NextResponse } from 'next/server';
import { readFile, stat } from 'fs/promises';
import path from 'path';

import { fetchContest } from '@/lib/fetch-contest';

export async function GET(request: Request, { params }: { params: any }) {
    const requestParams = await params;
    const [contestName, problemName] = requestParams.contest;
    console.log('Request params:', { contestName, problemName });

    if (!contestName || !problemName) {
        return NextResponse.json(
            {
                error: 'コンテスト名と問題名をエンドポイントに指定してください。'
            },
            { status: 400 }
        );
    }

    // const { platform } = await request.json();
    const platform = 'atcoder';
    const filePath = path.join(
        process.cwd(),
        'src/data',
        contestName,
        `${problemName}.json`
    );
    console.log('File path:', filePath);

    // ファイル存在確認
    const fileStat = await stat(filePath).catch(() => null);
    if (fileStat && fileStat.isFile()) {
        const fileData = await readFile(filePath, 'utf-8');
        return NextResponse.json(JSON.parse(fileData));
    }

    // ファイルが存在しなければスクレイピング
    const contestData = await fetchContest(
        platform,
        contestName,
        problemName
    ).catch((e) => {
        return NextResponse.json(
            {
                error: 'コンテストの取得中にエラーが発生しました。',
                details: e instanceof Error ? e.message : 'Unknown error'
            },
            { status: 500 }
        );
    });

    return NextResponse.json(contestData);
}
