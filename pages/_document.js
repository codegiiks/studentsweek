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
                    <link
                        href="https://fonts.googleapis.com/css2?family=Nunito:wght@100;200;300;400;500;600;700&display=swap"
                        rel="stylesheet"
                    />
                    {/* Global Site Tag (gtag.js) - Google Analytics */}
                    <script
                        async
                        src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}`}
                    />
                    <script
                        dangerouslySetInnerHTML={{
                            __html: `
                            window.dataLayer = window.dataLayer || [];
                            function gtag(){dataLayer.push(arguments);}
                            gtag('js', new Date());
                            gtag('config', '${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}', {
                              page_path: window.location.pathname,
                            });
                          `,
                        }}
                    />
                    <script
                        dangerouslySetInnerHTML={{
                            __html: `
                                (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
                                new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
                                j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
                                'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
                                })(window,document,'script','dataLayer','GTM-5SM88BD');
                        `,
                        }}
                    />
                </Head>
                <body>
                    <Main />
                    <NextScript />
                    <noscript>
                        <iframe
                            src="https://www.googletagmanager.com/ns.html?id=GTM-5SM88BD"
                            height="0"
                            width="0"
                            style="display:none;visibility:hidden"
                        ></iframe>
                    </noscript>
                </body>
            </Html>
        );
    }
}
