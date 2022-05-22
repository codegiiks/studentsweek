import Document, { Html, Head, Main, NextScript } from 'next/document';

export default class CustomDocument extends Document {
    static async getInitialProps(ctx) {
        const initialProps = await Document.getInitialProps(ctx);
        return { ...initialProps };
    }

    render() {
        return (
            <Html>
                <Head>
                    <link
                        rel="apple-touch-icon"
                        sizes="180x180"
                        href="/apple-touch-icon.png"
                    />
                    <link
                        rel="icon"
                        type="image/png"
                        sizes="32x32"
                        href="/favicon-32x32.png"
                    />
                    <link
                        rel="icon"
                        type="image/png"
                        sizes="16x16"
                        href="/favicon-16x16.png"
                    />
                    <link rel="manifest" href="/site.webmanifest" />
                    <link
                        rel="mask-icon"
                        href="/safari-pinned-tab.svg"
                        color="#069e00"
                    />
                    <meta
                        name="apple-mobile-web-app-title"
                        content="StudentsWeek"
                    />
                    <meta name="application-name" content="StudentsWeek" />
                    <meta name="msapplication-TileColor" content="#069e00" />
                    <meta name="theme-color" content="#069e00" />
                    <title>StudentsWeek</title>
                    <link
                        href="https://fonts.googleapis.com/css2?family=Nunito:wght@100;200;300;400;500;600;700&display=swap"
                        rel="stylesheet"
                    />
                </Head>
                <body>
                    <Main />
                    <NextScript />
                </body>
            </Html>
        );
    }
}
