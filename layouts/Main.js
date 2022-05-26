import { Navbar } from 'components';
import Head from 'next/head';
import style from 'styles/layouts/main.module.css';

export default function Main({ children, navbarClassname }) {
    return (
        <>
            <Head>
                <title>StudentsWeek</title>
            </Head>
            <main className={style.wrapper}>
                <Navbar className={navbarClassname} />
                {children}
            </main>
        </>
    );
}
