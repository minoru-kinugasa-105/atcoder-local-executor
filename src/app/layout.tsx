import type { Metadata } from 'next';
import './globals.scss';

export const metadata: Metadata = {
    title: 'AtCoder Local Executor',
    description: 'AtCoder Local Executor'
};

export default function RootLayout({
    children
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="ja">
            <head>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link
                    rel="preconnect"
                    href="https://fonts.gstatic.com"
                    crossOrigin="anonymous"
                />
                <link
                    href={
                        'https://fonts.googleapis.com/css2?' +
                        'family=Ubuntu+Mono:ital,wght@0,400;0,700;1,400;1,700&' +
                        'family=Noto+Sans+JP:wght@100..900&' +
                        'family=Roboto+Condensed:ital,wght@0,100..900;1,100..900&' +
                        'family=Roboto+Flex:opsz,wght,XOPQ@8..144,100..1000,27..175&' +
                        'family=Roboto+Mono:ital,wght@0,100..700;1,100..700&' +
                        'family=Roboto+Serif:ital,opsz,wdth,wght,GRAD@0,8..144,50..150,100..900,-50..100;1,8..144,50..150,100..900,-50..100&' +
                        'family=Roboto+Slab:wght@100..900&' +
                        'family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&' +
                        'family=Kiwi+Maru:wght@400;500&' +
                        'family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&' +
                        'family=Source+Code+Pro:ital,wght@0,200..900;1,200..900&' +
                        'family=Zen+Maru+Gothic:wght@300;400;500;700;900&' +
                        'display=swap'
                    }
                    rel="stylesheet"
                />
            </head>
            <body>{children}</body>
        </html>
    );
}
