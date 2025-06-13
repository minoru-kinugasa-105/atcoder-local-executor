import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { exec, spawn } from 'child_process';
import { promisify } from 'util';

import type { TestCase, Result } from '@/types/Judge';

const execAsync = promisify(exec);

export async function POST(request: Request) {
    const { platform, contest, problem, source, language, testCase } =
        await request.json();

    // ジャッジ結果を返す
    const result = await judge(language, source, testCase);
    return NextResponse.json(result);
}

// [TODO] メモリ、実行時間制限上限追加
async function judge(
    language: string,
    source: string,
    testCase: TestCase
): Promise<Result> {
    let result;

    if (language === 'cpp') {
        // ファイルを作成
        const mainFilePath = path.join(process.cwd(), 'src/temp', 'main.cpp');
        fs.writeFileSync(mainFilePath, source);

        // 結果フラグ
        let judge = 'AC';
        let stdout = '';
        let stderr = '';
        let usedMem = '0';
        let runtime = '0';

        // 実行時間計測（開始）
        const start = Date.now();

        try {
            // コンパイル
            const compileProcess = spawn('g++', [mainFilePath, '-o', 'main']);
            await new Promise<void>((resolve, reject) => {
                compileProcess.on('close', (code) => {
                    if (code === 0) resolve();
                    else
                        reject(
                            new Error(`Compilation failed with code ${code}`)
                        );
                });
            });

            // 実行
            const runProcess = spawn('./main');

            // 入力の書き込み
            runProcess.stdin.write(testCase.input);
            runProcess.stdin.end();

            // タイムアウト処理
            const timeoutPromise = new Promise<never>((_, reject) => {
                setTimeout(() => {
                    runProcess.kill();
                    reject(new Error('A-TLE'));
                }, 10000);
            });

            // 実行結果の取得
            const [output, error] = (await Promise.race([
                Promise.all([
                    new Promise<string>((resolve) => {
                        let data = '';
                        runProcess.stdout.on('data', (chunk: Buffer) => {
                            data += chunk.toString();
                        });
                        runProcess.on('close', () => resolve(data));
                    }),
                    new Promise<string>((resolve) => {
                        let data = '';
                        runProcess.stderr.on('data', (chunk: Buffer) => {
                            data += chunk.toString();
                        });
                        runProcess.on('close', () => resolve(data));
                    })
                ]),
                timeoutPromise
            ])) as [string, string];

            stdout = output;
            stderr = error;

            // 出力が一致しない場合はWA
            if (stdout !== testCase.output) {
                judge = 'WA';
            }
        } catch (error: any) {
            judge = error.message === 'A-TLE' ? 'A-TLE' : 'RE';
            stderr = `exec error: ${error.message}`;
        }

        // 実行時間計測（終了）
        const end = Date.now();
        runtime = `${(end - start) / 1000}秒`;

        result = {
            judge,
            stdout,
            stderr,
            used_mem: usedMem,
            runtime
        };
    }

    return result as Result;
}
