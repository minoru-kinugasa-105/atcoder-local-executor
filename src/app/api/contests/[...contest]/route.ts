import { NextResponse } from 'next/server';
import { readFile, stat } from 'fs/promises';
import path from 'path';

import { fetchContest } from '@/lib/fetch-contest';

export async function GET(request: Request, { params }: { params: any }) {
    const requestParams = await params;
    const [contestPlatform, contestName, problemName] = requestParams.contest;
    console.log('Request params:', { contestPlatform, contestName, problemName });

    if (!contestPlatform || !contestName || !problemName) {
        return NextResponse.json(
            {
                error: 'プラットフォームとコンテスト名と問題名をエンドポイントに指定してください。'
            },
            { status: 400 }
        );
    }

    const filePath = path.join(
        process.cwd(),
        'src/data',
        contestPlatform,
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
        contestPlatform,
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
