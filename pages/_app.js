import Head from 'next/head';
import 'styles/globals.css';

function MyApp({ Component, pageProps }) {
    const getLayout = Component.getLayout || ((v) => v);

    return getLayout(
        <>
            <Head>
                <title>StudentsWeek</title>
            </Head>
            <Component {...pageProps} />
        </>
    );
}

export default MyApp;
