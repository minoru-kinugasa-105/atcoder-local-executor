import { JSDOM } from 'jsdom';
import { CookieJar } from 'tough-cookie';
import fetchCookie from 'fetch-cookie';
import { readFile } from 'fs/promises';
import path from 'path';

const jar = new CookieJar();
const fetchWithCookie = fetchCookie(fetch, jar);

let isLoggedIn = false;

export async function fetchAsUser(url: string) {
    if (!isLoggedIn) {
        const loginUrl = 'https://atcoder.jp/login';
        const userdata = JSON.parse(
            await readFile(
                path.join(process.cwd(), 'src/data/userdata.json'),
                'utf-8'
            )
        );
        const username = userdata.username;
        const password = userdata.password;

        const loginPage = await fetchWithCookie(loginUrl);
        const html = await loginPage.text();
        const dom = new JSDOM(html);
        const csrfToken = (
            dom.window.document.querySelector(
                'input[name="csrf_token"]'
            ) as HTMLInputElement
        )?.value;

        if (!csrfToken) {
            throw new Error('CSRF token not found');
        }

        const formData = new URLSearchParams();
        formData.append('username', username);
        formData.append('password', password);
        formData.append('csrf_token', csrfToken);

        const res = await fetchWithCookie(loginUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: formData.toString(),
            redirect: 'manual'
        });

        if (res.status === 302) {
            console.log('✅ ログイン成功');
            isLoggedIn = true;
        } else {
            console.log('❌ ログイン失敗');
            throw new Error('ログインに失敗しました');
        }
    }

    return await fetchWithCookie(url);
}
