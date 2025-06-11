'use client';

import { useState, useEffect } from 'react';

export default function Home() {
    const [sourceCode, setSourceCode] = useState(`
using namespace std;
int main() {
    cout << "Hello, World!" << endl;
    return 0;
}
`);

    async function handleRun() {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/correct`, {
            method: 'POST',
            body: JSON.stringify({
                contest: 'abc100',
                problem: 'A',
                source: sourceCode,
                language: 'cpp'
            })
        });
        const data = await response.json();
        console.log(data);
    }

    return (
        <>
            <textarea
                value={sourceCode}
                onChange={(e) => setSourceCode(e.target.value)}
            />
            <button onClick={handleRun}>実行</button>
        </>
    );
}
