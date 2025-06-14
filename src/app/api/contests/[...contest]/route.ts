import { NextResponse } from 'next/server';
import { readFile, stat, writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { JSDOM } from 'jsdom';
import { dirname } from 'path';

import { fetchContest } from '@/lib/fetch-contest';

export async function GET(request: Request, { params }: { params: any }) {
    const requestParams = await params;
    const [platform, contest, problem] = requestParams.contest;
    console.log('Request params:', { platform, contest, problem });

    if (!platform || !contest) {
        return NextResponse.json(
            {
                error: 'プラットフォームとコンテスト名をエンドポイントに指定してください。'
            },
            { status: 400 }
        );
    }

    // コンテストres
    if (!problem) {
        const filePath = path.join(
            process.cwd(),
            'src/data',
            platform,
            contest,
            'data.json'
        );

        let allData;
        try {
            const fileContent = await readFile(filePath, 'utf-8');
            allData = JSON.parse(fileContent);
        } catch (error) {
            // まだFetchしていない場合は作成
            allData = { isAllFetched: false, problems: [] };
            const dir = dirname(filePath);
            await mkdir(dir, { recursive: true });
            await writeFile(filePath, JSON.stringify(allData, null, 4));
        }

        if (allData.problems?.length === 0 || !allData.problems) {
            const url = `https://atcoder.jp/contests/${contest}/tasks`;
            const response = await fetch(url);
            const html = await response.text();
            const dom = new JSDOM(html);
            const doc = dom.window.document;
            const trs = [
                ...new Set(Array.from(doc.querySelectorAll('tbody tr')))
            ];

            for (const tr of trs) {
                const aTag = tr.querySelector('a');
                if (!allData.problems) {
                    allData.problems = [];
                }

                if (aTag) {
                    const problemName = aTag.href.split('tasks/')[1];
                    allData.problems.push(problemName);
                }
            }

            await writeFile(filePath, JSON.stringify(allData, null, 4));
        }

        // 最初の問題の取得をしておく
        const problemFilePath = path.join(
            process.cwd(),
            'src/data',
            platform,
            contest,
            `${allData.problems[0]}.json`
        );
        const fileStat = await stat(problemFilePath).catch(() => null);

        if (!fileStat) {
            const testCases = await fetchContest(
                platform,
                contest,
                allData.problems[0]
            ).catch((e) => {
                return NextResponse.json(
                    {
                            error: 'コンテストの取得中にエラーが発生しました。',
                            details:
                                e instanceof Error ? e.message : 'Unknown error'
                        },
                        { status: 500 }
                    );
                }
            );
            // await writeFile(problemFilePath, JSON.stringify(testCases, null, 4));
            console.log(testCases);
        }

        return NextResponse.json(allData);
    }

    // テストケースres
    const filePath = path.join(
        process.cwd(),
        'src/data',
        platform,
        contest,
        `${problem}.json`
    );
    console.log('File path:', filePath);

    // ファイル存在確認
    const fileStat = await stat(filePath).catch(() => null);
    if (fileStat && fileStat.isFile()) {
        const fileData = await readFile(filePath, 'utf-8');
        return NextResponse.json(JSON.parse(fileData));
    }

    // ファイルが存在しなければスクレイピング
    const contestData = await fetchContest(platform, contest, problem).catch(
        (e) => {
            return NextResponse.json(
                {
                    error: 'コンテストの取得中にエラーが発生しました。',
                    details: e instanceof Error ? e.message : 'Unknown error'
                },
                { status: 500 }
            );
        }
    );

    return NextResponse.json(contestData);
}
