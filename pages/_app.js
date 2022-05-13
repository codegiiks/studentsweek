import 'styles/globals.css';

function MyApp({ Component, pageProps }) {
    const getLayout = Component.getLayout || ((v) => v);

    return getLayout(<Component {...pageProps} />);
}

export default MyApp;
