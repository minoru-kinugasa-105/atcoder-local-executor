'use client';

import { useState, useEffect } from 'react';

import type { TestCase, Result } from '@/types/Judge';

import { Copy, Play } from 'lucide-react';

import '@/styles/layouts/components/section.scss';

export default function Home() {
    const sourceCode = `
#include <iostream>
#include <cstdio>
#include <cstdlib>
#include <cmath>
#include <algorithm>
#include <vector>
#include <map>
#include <set>
#include <queue>
#include <stack>
#include <string>
#include <cstring>
#include <cassert>
#include <climits>
#include <cctype>
#include <ctime>
#include <numeric>
#include <functional>
#include <bitset>
#include <unordered_map>
#include <unordered_set>
using namespace std;
using ll = long long;

int main() {
	int N;
	string T,A;
    cin >> N;
    cin >> T;
    cin >> A;
    
    for (int i = 0; i < N; i++) {
        if (T[i] == 'o' && A[i] == 'o') {
            cout << "Yes" << endl;
            return 0;
        }
    }

    cout << "No" << endl;

    return 0;
}
`;

    const [form, setForm] = useState({
        platform: 'atcoder',
        contest: 'abc409',
        problem: '',
        source: sourceCode,
        language: 'cpp'
    });

    const [testCases, setTestCases] = useState<TestCase[]>([]);
    const [problems, setProblems] = useState<string[]>([]);

    const [allResults, setAllResults] = useState<Result[][]>([]);

    useEffect(() => {
        console.debug(allResults);
    }, [allResults]);

    // useEffect(() => {
    //     handleFetchProbmels();
    // }, []);

    useEffect(() => {
        if (form.problem) {
            handleFetchTestCases();
        }
    }, [form.problem]);

    async function handleRunAll() {
        const resultsSection = document.getElementById('results');
        if (resultsSection) {
            resultsSection.scrollIntoView({ behavior: 'smooth' });
        }

        const key = allResults.length;
        const defaultResult: Result = {
            judge: 'WJ',
            stdout: '',
            stderr: '',
            used_mem: '',
            runtime: ''
        };

        // 最初に WJ で埋める（先に1回 set する）
        setAllResults((prevResults) => [
            ...prevResults,
            Array(testCases.length).fill(defaultResult)
        ]);

        for (let i = 0; i < testCases.length; i++) {
            const testCase = testCases[i];

            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_BASE_URL}correct`,
                {
                    method: 'POST',
                    body: JSON.stringify({
                        ...form,
                        problem:
                            form.platform === 'atcoder'
                                ? `${form.contest}_${form.problem.toLowerCase()}`
                                : form.problem.toLowerCase(),
                        testCase: testCase
                    })
                }
            );
            const data = await response.json();

            // i 番目を WJ → 実際の結果に更新
            setAllResults((prevResults) => {
                const updated = [...prevResults];
                const targetResultArray = [...updated[key]];
                targetResultArray[i] = data;
                updated[key] = targetResultArray;
                return updated;
            });
        }
    }

    async function handleRunSingle(testCase: TestCase) {
        const resultsSection = document.getElementById('results');
        if (resultsSection) {
            resultsSection.scrollIntoView({ behavior: 'smooth' });
        }

        const key = allResults.length;
        const defaultResult: Result = {
            judge: 'WJ',
            stdout: '',
            stderr: '',
            used_mem: '',
            runtime: ''
        };

        // 最初に WJ で埋める（先に1回 set する）
        setAllResults((prevResults) => [...prevResults, [defaultResult]]);

        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}correct`,
            {
                method: 'POST',
                body: JSON.stringify({
                    ...form,
                    problem:
                        form.platform === 'atcoder'
                            ? `${form.contest}_${form.problem.toLowerCase()}`
                            : form.problem.toLowerCase(),
                    testCase: testCase
                })
            }
        );
        const data = await response.json();

        // 結果を更新
        setAllResults((prevResults) => {
            const updated = [...prevResults];
            updated[key] = [data];
            return updated;
        });
    }

    async function handleFetchProbmels() {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}contests/${form.platform}/${form.contest}/`
        );
        const data = await response.json();
        setProblems(data.problems);
        if (data.problems && data.problems.length > 0) {
            setForm((prev) => ({
                ...prev,
                problem: data.problems[0]
            }));
        }
    }

    async function handleFetchTestCases() {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}contests/${form.platform}/${form.contest}/${form.problem}/`
        );
        const data = await response.json();
        console.warn(data);
        setTestCases(data);
    }

    return (
        <>
            <main className="main">
                <div className="main-container">
                    <div className="main-headline"></div>
                    <div className="main-body">
                        <section className="section">
                            <div className="section-headline">
                                <h2>ベース情報</h2>
                            </div>
                            <div className="section-body">
                                <div className="component">
                                    <div className="component-headline">
                                        <h3>プラットフォーム</h3>
                                    </div>
                                    <div className="component-body">
                                        <label>
                                            <input
                                                type="radio"
                                                name="platform"
                                                value="atcoder"
                                                checked={
                                                    form.platform === 'atcoder'
                                                }
                                                onChange={(e) =>
                                                    setForm({
                                                        ...form,
                                                        platform: e.target.value
                                                    })
                                                }
                                            />
                                            atcoder
                                        </label>
                                    </div>
                                </div>

                                <div className="component">
                                    <div className="component-headline">
                                        <h3>コンテスト</h3>
                                    </div>
                                    <div className="component-body">
                                        <input
                                            type="text"
                                            value={form.contest}
                                            onChange={(e) =>
                                                setForm({
                                                    ...form,
                                                    contest: e.target.value
                                                })
                                            }
                                        />
                                        <button onClick={handleFetchProbmels}>
                                            問題を取得
                                        </button>
                                    </div>
                                </div>

                                <div className="component">
                                    <div className="component-headline">
                                        <h3>問題</h3>
                                    </div>
                                    <div className="component-body">
                                        {problems.map((problem, index) => {
                                            return (
                                                <label key={index}>
                                                    <input
                                                        type="radio"
                                                        name="problem"
                                                        value={problem}
                                                        checked={
                                                            form.problem ===
                                                            problem
                                                        }
                                                        onChange={(e) =>
                                                            setForm({
                                                                ...form,
                                                                problem:
                                                                    e.target
                                                                        .value
                                                            })
                                                        }
                                                    />
                                                    {problem}
                                                </label>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        </section>

                        <section className="section">
                            <div className="section-headline">
                                <h2>
                                    テストケース
                                    {form.problem
                                        ? `: （${form.problem}）`
                                        : ''}
                                </h2>
                            </div>
                            <div className="section-body">
                                {testCases.map((testCase, index) => (
                                    <>
                                        <div
                                            className="component testcase"
                                            key={index}
                                        >
                                            <div className="component-headline">
                                                <h3>
                                                    入力例{index + 1}
                                                    <button
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            navigator.clipboard.writeText(
                                                                testCase.input ||
                                                                    ''
                                                            );
                                                        }}
                                                    >
                                                        <Copy />
                                                        Copy
                                                    </button>
                                                    <button
                                                        onClick={() =>
                                                            handleRunSingle(
                                                                testCases[index]
                                                            )
                                                        }
                                                    >
                                                        <Play />
                                                        Run
                                                    </button>
                                                </h3>
                                            </div>
                                            <div className="component-body">
                                                <pre>{testCase.input}</pre>
                                            </div>

                                            <div className="component-headline">
                                                <h3>
                                                    出力例{index + 1}
                                                    <button
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            navigator.clipboard.writeText(
                                                                testCase.output ||
                                                                    ''
                                                            );
                                                        }}
                                                    >
                                                        <Copy />
                                                        Copy
                                                    </button>
                                                </h3>
                                            </div>
                                            <div className="component-body">
                                                <pre>{testCase.output}</pre>
                                            </div>
                                        </div>
                                        <hr />
                                    </>
                                ))}
                            </div>
                        </section>

                        <section className="section">
                            <div className="section-headline">
                                <h2>ソースコード</h2>
                            </div>
                            <div className="section-body">
                                <textarea
                                    style={{
                                        display: 'block'
                                    }}
                                    value={form.source}
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            source: e.target.value
                                        })
                                    }
                                />

                                <button onClick={handleRunAll}>
                                    <Play />
                                    全てのテストケースを実行
                                </button>
                            </div>
                        </section>

                        <section className="section" id="results">
                            <div className="section-headline">
                                <h2>ジャッジ結果</h2>
                            </div>
                            <div className="section-body">
                                <ul className="results">
                                    {allResults
                                        .slice() // 元の配列をコピーして
                                        .reverse() // 逆順にして
                                        .map((results, resultsIdx) => {
                                            return (
                                                <li
                                                    key={resultsIdx}
                                                    className={`result ${
                                                        results.every(
                                                            (result) =>
                                                                result.judge ===
                                                                'AC'
                                                        )
                                                            ? 'all-ac'
                                                            : results.some(
                                                                    (result) =>
                                                                        result.judge ===
                                                                        'WJ'
                                                                )
                                                              ? 'something-wj'
                                                              : results.some(
                                                                      (
                                                                          result
                                                                      ) =>
                                                                          result.judge !==
                                                                          'AC'
                                                                  )
                                                                ? 'something-wa'
                                                                : ''
                                                    }`}
                                                >
                                                    <div className="result-progress">
                                                        {results.map(
                                                            (
                                                                result,
                                                                resultIdx
                                                            ) => {
                                                                return (
                                                                    <div
                                                                        key={
                                                                            resultIdx
                                                                        }
                                                                        className={`result-progress-item ${result.judge.toLocaleLowerCase()}`}
                                                                    >
                                                                        <span>
                                                                            {
                                                                                result.judge
                                                                            }
                                                                        </span>
                                                                    </div>
                                                                );
                                                            }
                                                        )}
                                                    </div>

                                                    <details className="result-details">
                                                        <summary>
                                                            詳細を閲覧
                                                        </summary>
                                                        <table className="result-table">
                                                            <thead>
                                                                <tr>
                                                                    <th>
                                                                        テストケース
                                                                    </th>
                                                                    <th>
                                                                        結果
                                                                    </th>
                                                                    <th>
                                                                        実行時間
                                                                    </th>
                                                                    <th>
                                                                        使用メモリ
                                                                    </th>
                                                                    <th className="result-std-details"></th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {results.map(
                                                                    (
                                                                        result,
                                                                        resultIdx
                                                                    ) => {
                                                                        return (
                                                                            <ResultTableRow
                                                                                key={
                                                                                    resultIdx
                                                                                }
                                                                                result={
                                                                                    result
                                                                                }
                                                                            />
                                                                        );
                                                                    }
                                                                )}
                                                            </tbody>
                                                        </table>
                                                    </details>
                                                </li>
                                            );
                                        })}
                                </ul>
                            </div>
                        </section>
                    </div>
                </div>
            </main>
        </>
    );
}

function ResultTableRow({ result }: { result: Result }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <tr>
                {/* <td>{result.testcase}</td> */}
                <td>テストケース</td>
                <td>
                    <span className={result.judge.toLocaleLowerCase()}>
                        {result.judge}
                    </span>
                </td>
                <td>{result.runtime}</td>
                <td>{result.used_mem}</td>
                <td className="result-std-details">
                    <details open={isOpen} onClick={(e) => e.preventDefault()}>
                        <summary
                            onClick={() => {
                                setIsOpen((prev) => !prev);
                            }}
                        >
                            詳細
                        </summary>
                    </details>
                </td>
            </tr>
            {isOpen && (
                <tr style={{ borderTop: 'dotted 1px #aaa' }}>
                    <td colSpan={5}>
                        <div className="std-container">
                            <div className="result-std out">
                                <pre>{result.stdout}</pre>
                            </div>
                            <div className="result-std err">
                                <pre>{result.stderr}</pre>
                            </div>
                        </div>
                    </td>
                </tr>
            )}
        </>
    );
}
