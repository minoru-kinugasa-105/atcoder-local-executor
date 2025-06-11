'use client';

import { useState, useEffect } from 'react';

export default function Home() {
    const [isTestMessage, setIsTestMessage] = useState(false);

    useEffect(() => {
        async function dataFetch() {
            const res = await fetch('/api/');
            const data = await res.json();
            console.log(data);
            setIsTestMessage(data.message);
        }
        dataFetch();
    }, []);

    return (
        <div>
            <img src="/image.png" alt="logo" />
            <p>{isTestMessage}</p>
        </div>
    );
}
