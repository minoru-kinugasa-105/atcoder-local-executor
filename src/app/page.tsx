'use client';

import { useState, useEffect } from 'react';

import type { TestCase } from '@/types/Judge';
import { platform } from 'os';

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
        problem: 'a',
        source: sourceCode,
        language: 'cpp'
    });

    const [testCases, setTestCases] = useState<TestCase[]>([]);

    async function handleRun() {
        for (const testCase of testCases) {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_BASE_URL}correct`,
                {
                    method: 'POST',
                    body: JSON.stringify({
                        ...form,
                        problem:
                            form.platform == 'atcoder'
                                ? `${form.contest}_${form.problem.toLowerCase()}`
                                : form.problem.toLowerCase(),
                        testCase: testCase
                    })
                }
            );
            const data = await response.json();
            console.log(data);
        }
    }

    async function handleFetchTestCases() {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}contests/${form.platform}/${form.contest}/${
                form.platform == 'atcoder'
                    ? `${form.contest}_${form.problem.toLowerCase()}`
                    : form.problem.toLowerCase()
            }`
        );
        const data = await response.json();
        console.warn(data);
        setTestCases(data);
    }

    return (
        <>
            <input
                type="text"
                placeholder="atcoder"
                value={form.platform}
                onChange={(e) => setForm({ ...form, platform: e.target.value })}
            />
            <input
                type="text"
                placeholder="abc100"
                value={form.contest}
                onChange={(e) => setForm({ ...form, contest: e.target.value })}
            />
            <input
                type="text"
                placeholder="a"
                value={form.problem}
                onChange={(e) => setForm({ ...form, problem: e.target.value })}
            />
            <textarea
                value={form.source}
                onChange={(e) => setForm({ ...form, source: e.target.value })}
            />
            <button onClick={handleRun}>実行</button>

            <hr />

            <div>
                {testCases.map((testCase, index) => (
                    <div key={index} style={{ marginLeft: '10px' }}>
                        <div>入力</div>
                        <pre>{testCase.input}</pre>
                        <div style={{ marginTop: '10px' }}>出力</div>
                        <pre>{testCase.output}</pre>
                        <hr />
                    </div>
                ))}
            </div>
            <button onClick={handleFetchTestCases}>テストケースを取得</button>
        </>
    );
}
