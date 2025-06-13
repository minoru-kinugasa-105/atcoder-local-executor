import { writeFile, mkdir, readFile } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import { JSDOM } from 'jsdom';

import type { TestCase } from '@/types/Judge';

export async function fetchContest(
    platform: string,
    contestName: string,
    problemName: string
): Promise<TestCase[]> {
    console.log('fetchContest\n'.repeat(10));
    const url = `https://atcoder.jp/contests/${contestName}/tasks/${problemName}`;
    let data: TestCase[] = [];

    try {
        const response = await fetch(url);

        const html = await response.text();

        // DOM解析
        const dom = new JSDOM(html);
        const doc = dom.window.document;
        const parts = Array.from(
            doc.querySelectorAll('#task-statement .part')
        ).filter((part) => {
            const h3 = part.querySelector('h3');
            return h3 && /入力例|出力例/i.test(h3.textContent ?? '');
        });

        // DOMからデータを取得
        data = parts
            .map((part, index) => {
                const pre = part.querySelector('pre');
                const text = pre?.textContent;
                const type = index % 2 === 0 ? 'input' : 'output';
                return { [type]: text } as Partial<TestCase>;
            })
            .reduce<TestCase[]>((acc, current, index) => {
                if (index % 2 === 0) {
                    acc.push(current as TestCase);
                } else {
                    const lastIndex = acc.length - 1;
                    acc[lastIndex] = { ...acc[lastIndex], ...current };
                }
                return acc;
            }, []);

        // 該当問題のデータを保存
        const filePath = path.join(
            process.cwd(),
            'src/data',
            platform,
            contestName,
            `${problemName}.json`
        );
        const dirPath = path.dirname(filePath);
        await mkdir(dirPath, { recursive: true });
        await writeFile(filePath, JSON.stringify(data, null, 4));

        // 該当のコンテストの問題を全てFetchしているか確認
        const allDataFilePath = path.join(
            process.cwd(),
            'src/data',
            contestName,
            'data.json'
        );
        let allData;
        try {
            const fileContent = await readFile(allDataFilePath, 'utf-8');
            allData = JSON.parse(fileContent);
        } catch (error) {
            // まだFetchしていない場合はフラグ保存用ファイルを作成しAllFetch
            allData = { isAllFetched: false };
            await writeFile(allDataFilePath, JSON.stringify(allData, null, 4));
        }
        if (!allData.isAllFetched) {
            allFetchContest(platform, contestName);
        }
    } catch (error) {
        console.error('データの取得中にエラーが発生しました:', error);
    }

    return data;
}

async function allFetchContest(platform: string, contestName: string) {
    const url = `https://atcoder.jp/contests/${contestName}/tasks`;
    const response = await fetch(url);
    const html = await response.text();
    const dom = new JSDOM(html);
    const doc = dom.window.document;
    const trs = Array.from(doc.querySelectorAll('tbody tr'));

    const allDataFilePath = path.join(
        process.cwd(),
        'src/data',
        platform,
        contestName,
        'data.json'
    );
    await writeFile(
        allDataFilePath,
        JSON.stringify({ isAllFetched: true }, null, 4)
    );

    for (const tr of trs) {
        const aTag = tr.querySelector('a');
        if (aTag) {
            const problemName = aTag.href.split('tasks/')[1];

            // すでにFetchしているデータであればスキップ
            const problemFilePath = path.join(
                process.cwd(),
                'src/data',
                contestName,
                `${problemName}.json`
            );
            if (existsSync(problemFilePath)) {
                continue;
            }

            await fetchContest(platform, contestName, problemName);
            await new Promise((resolve) => setTimeout(resolve, 1000));
        }
    }
}
